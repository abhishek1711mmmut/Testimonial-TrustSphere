import copy
import os
import unittest
from unittest.mock import MagicMock, patch

from flask import Flask
from routes.support_routes import bp
from services.support_services import MAX_BODY_BYTES, reserve_send
from utils.mailSender import init_mail, mail, send_email


class SupportTests(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config.update(TESTING=True, SUPPORT_EMAIL="author@example.com")
        self.app.register_blueprint(bp)
        self.client = self.app.test_client()
        self.data = dict(name="A Visitor", email="visitor@example.com", subject="Embed question",
                         message="How do I add a carousel to my site?", phone="", consent=True, website="")
        self.sender = patch("services.support_services.send_email", return_value={"success": True}).start()
        self.throttle = patch("services.support_services.reserve_send", return_value=0).start()
        self.addCleanup(patch.stopall)

    def test_public_submission_fixed_recipient_and_reply_to(self):
        self.data["recipient"] = "attacker@example.com"
        self.data["name"] = "  A Visitor  "
        response = self.client.post("/api/support/contact", json=self.data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json["success"])
        self.assertEqual(response.headers["Cache-Control"], "no-store")
        args, kwargs = self.sender.call_args
        self.assertEqual(args[0], "[TrustSphere Support] Embed question")
        self.assertEqual(args[1], "author@example.com")
        self.assertIn("Name: A Visitor\n", args[2])
        self.assertIn("Phone: Not provided", args[2])
        self.assertEqual(kwargs["reply_to"], "visitor@example.com")

    def test_validation_prevents_mail_and_rate_reservation(self):
        for field, value in [("name", "  "), ("name", ["invalid"]), ("email", "not-an-email"),
                             ("email", "x@example.com\r\nBcc: victim@example.com"),
                             ("subject", "Hello\r\nBcc: victim@example.com"), ("subject", "x" * 151),
                             ("message", ""), ("message", "x" * 5001), ("phone", "abc"),
                             ("consent", False), ("consent", "true")]:
            with self.subTest(field=field, value=str(value)[:30]):
                data = copy.deepcopy(self.data)
                data[field] = value
                response = self.client.post("/api/support/contact", json=data)
                self.assertEqual(response.status_code, 400)
                self.assertIn(field, response.json["errors"])
        self.sender.assert_not_called()
        self.throttle.assert_not_called()

    def test_bad_json_oversized_body_and_honeypot(self):
        for kwargs, status in [({"json": []}, 400),
                               ({"data": "{", "content_type": "application/json"}, 400),
                               ({"data": "x"}, 415),
                               ({"json": {**self.data, "website": "spam"}}, 400),
                               ({"data": " " * (MAX_BODY_BYTES + 1), "content_type": "application/json"}, 413)]:
            self.assertEqual(self.client.post("/api/support/contact", **kwargs).status_code, status)
        self.sender.assert_not_called()
        self.throttle.assert_not_called()

    def test_international_phone_and_plain_text_message(self):
        self.data.update(phone="+44 (20) 1234-5678", message="<script>not HTML</script>\nSecond line")
        self.assertEqual(self.client.post("/api/support/contact", json=self.data).status_code, 200)
        self.assertIn(self.data["message"], self.sender.call_args.args[2])

    def test_rate_limit(self):
        self.throttle.return_value = 120
        response = self.client.post("/api/support/contact", json=self.data)
        self.assertEqual(response.status_code, 429)
        self.assertEqual(response.headers["Retry-After"], "120")
        self.sender.assert_not_called()

    def test_mail_and_database_failures_do_not_claim_success(self):
        self.sender.return_value = {"success": False}
        response = self.client.post("/api/support/contact", json=self.data)
        self.assertEqual(response.status_code, 503)
        self.assertFalse(response.json["success"])
        self.sender.reset_mock()
        self.throttle.side_effect = RuntimeError("private connection detail")
        with self.assertLogs(self.app.logger, level="ERROR"):
            response = self.client.post("/api/support/contact", json=self.data)
        self.assertEqual(response.status_code, 503)
        self.assertNotIn("private connection detail", response.get_data(as_text=True))
        self.sender.assert_not_called()


class SupportThrottleTests(unittest.TestCase):
    def test_commit_or_rollback_and_close(self):
        for counts, allowed in [([(1,), (1,)], True), ([(30,), (3,)], True),
                                ([(31,)], False), ([(10,), (4,)], False)]:
            with self.subTest(counts=counts), patch("services.support_services.mysql") as mysql:
                connection = mysql.connection
                cursor = connection.cursor.return_value
                cursor.fetchone.side_effect = counts
                with patch("services.support_services.time.time", return_value=1000):
                    retry = reserve_send("visitor@example.com")
                self.assertEqual(retry, 0 if allowed else 800)
                if allowed:
                    connection.commit.assert_called_once()
                    connection.rollback.assert_not_called()
                else:
                    connection.rollback.assert_called_once()
                    connection.commit.assert_not_called()
                cursor.close.assert_called_once()

    def test_database_error_rolls_back(self):
        with patch("services.support_services.mysql") as mysql:
            connection = mysql.connection
            connection.cursor.return_value.execute.side_effect = RuntimeError("unavailable")
            with self.assertRaises(RuntimeError):
                reserve_send("visitor@example.com")
            connection.rollback.assert_called_once()
            connection.cursor.return_value.close.assert_called_once()


class SupportMailTests(unittest.TestCase):
    def test_mail_headers_without_real_delivery_and_otp_compatibility(self):
        app = Flask(__name__)
        app.config.update(TESTING=True, MAIL_SUPPRESS_SEND=True)
        init_mail(app)
        with app.app_context(), patch.dict(os.environ, {"MAIL_USERNAME": "sender@example.com"}), mail.record_messages() as outbox:
            result = send_email("Support", "author@example.com", "Plain text", reply_to="visitor@example.com")
            self.assertTrue(result["success"])
            self.assertEqual(outbox[0].sender, "sender@example.com")
            self.assertEqual(outbox[0].recipients, ["author@example.com"])
            self.assertEqual(outbox[0].reply_to, "visitor@example.com")
            self.assertIsNone(outbox[0].html)
            self.assertTrue(send_email("OTP", "user@example.com", "123456")["success"])
            self.assertIsNone(outbox[1].reply_to)


if __name__ == "__main__":
    unittest.main()
