import json
import os
import unittest
from unittest.mock import patch
from urllib.error import HTTPError, URLError

from utils.mailSender import send_email


class BrevoMailTests(unittest.TestCase):
    def setUp(self):
        self.env = patch.dict(os.environ, {
            "MAIL_PROVIDER": "brevo", "BREVO_API_KEY": "test-secret",
            "BREVO_SENDER_EMAIL": "sender@example.com",
            "BREVO_SENDER_NAME": "TrustSphere",
        })
        self.env.start()
        self.addCleanup(self.env.stop)

    @patch("utils.brevo_sender.urlopen")
    def test_payload_and_existing_return_contract(self, transport):
        response = transport.return_value.__enter__.return_value
        response.status = 201
        response.read.return_value = b'{"messageId":"test-id"}'
        with patch("utils.mailSender.mail.send") as smtp:
            result = send_email("OTP", "user@example.com", "123456")
            self.assertTrue(result["success"])
            smtp.assert_not_called()
        request = transport.call_args.args[0]
        self.assertEqual(request.full_url, "https://api.brevo.com/v3/smtp/email")
        self.assertEqual(transport.call_args.kwargs["timeout"], 10)
        payload = json.loads(request.data)
        self.assertEqual(payload["to"], [{"email": "user@example.com"}])
        self.assertEqual(payload["textContent"], "123456")
        self.assertNotIn("replyTo", payload)
        self.assertEqual(request.get_header("Api-key"), "test-secret")
        send_email("Support", "author@example.com", "Help", reply_to="visitor@example.com")
        self.assertEqual(json.loads(transport.call_args.args[0].data)["replyTo"],
                         {"email": "visitor@example.com"})

    @patch("utils.brevo_sender.urlopen")
    def test_failure_returns_false_without_smtp_fallback(self, transport):
        for error in (TimeoutError(), URLError("offline"),
                      HTTPError("https://api.brevo.com", 429, "quota", {}, None)):
            with self.subTest(error=type(error).__name__):
                transport.reset_mock()
                transport.side_effect = error
                with patch("utils.mailSender.mail.send") as smtp:
                    self.assertFalse(send_email("OTP", "user@example.com", "123456")["success"])
                    smtp.assert_not_called()
                transport.assert_called_once()

    @patch("utils.brevo_sender.urlopen")
    def test_missing_credentials_and_invalid_provider_fail_closed(self, transport):
        for settings in ({"BREVO_API_KEY": ""}, {"BREVO_SENDER_EMAIL": ""},
                         {"MAIL_PROVIDER": "invalid"}):
            with patch.dict(os.environ, settings):
                self.assertFalse(send_email("OTP", "user@example.com", "123456")["success"])
        transport.assert_not_called()

    @patch("utils.brevo_sender.urlopen")
    def test_missing_confirmation_is_failure(self, transport):
        response = transport.return_value.__enter__.return_value
        response.status = 201
        response.read.return_value = b'{}'
        self.assertFalse(send_email("OTP", "user@example.com", "123456")["success"])
