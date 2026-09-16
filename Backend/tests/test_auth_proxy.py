"""Cookie and session regressions; no database or network services required."""
import os
import unittest
from datetime import timedelta
from unittest.mock import MagicMock, patch

from flask import Flask, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from config.auth import init_auth
from routes.auth_routes import bp


def create_test_app():
    app = Flask(__name__)
    app.config.update(TESTING=True, JWT_SECRET_KEY="test-only-key-not-for-production-123456789")
    init_auth(app)
    app.register_blueprint(bp)

    @app.route("/api/check", methods=["GET", "POST"])
    @jwt_required()
    def check():
        return jsonify(identity=get_jwt_identity(), query=request.args.to_dict(),
                       form=request.form.to_dict(),
                       files={key: len(value.read()) for key, value in request.files.items()})

    return app


class AuthCookieTests(unittest.TestCase):
    def setUp(self):
        self.env = patch.dict(os.environ, {"JWT_COOKIE_SECURE": "false", "COOKIE_DOMAIN": "old-backend.example.com"})
        self.env.start()
        self.app = create_test_app()
        self.client = self.app.test_client()

    def tearDown(self):
        self.env.stop()

    def login(self):
        mysql = MagicMock()
        mysql.connection.cursor.return_value.fetchone.return_value = (
            1, "Test", "User", "test@example.com", "mock-password-hash",
        )
        with patch("services.auth_services.mysql", mysql), patch("services.auth_services.bcrypt.checkpw", return_value=True):
            return self.client.post("/api/auth/login", json={"email": "test@example.com", "password": "test"})

    def test_login_cookie_and_authenticated_request(self):
        response = self.login()
        self.assertEqual(response.status_code, 200)
        cookie = response.headers["Set-Cookie"]
        for attribute in ["HttpOnly", "SameSite=Lax", "Path=/", "Max-Age=259200"]:
            self.assertIn(attribute, cookie)
        self.assertNotIn("Domain=", cookie)
        self.assertNotIn("Secure", cookie)
        self.assertEqual(self.client.get("/api/check").json["identity"], "1")

    def test_production_secure_cookie_and_logout(self):
        self.app.config["JWT_COOKIE_SECURE"] = True
        response = self.login()
        self.assertIn("Secure", response.headers["Set-Cookie"])
        response = self.client.get("/api/auth/logout", base_url="https://localhost")
        self.assertEqual(response.status_code, 200)
        for attribute in ["Expires=Thu, 01 Jan 1970 00:00:00 GMT", "Secure", "HttpOnly", "SameSite=Lax", "Path=/"]:
            self.assertIn(attribute, response.headers["Set-Cookie"])
        self.assertNotIn("Domain=", response.headers["Set-Cookie"])
        self.assertEqual(self.client.get("/api/check").status_code, 401)

    def test_missing_expired_and_invalid_sessions(self):
        with self.app.app_context():
            expired = create_access_token(identity="1", expires_delta=timedelta(seconds=-10))
        for token in [None, expired, "not-a-jwt"]:
            with self.subTest(token_type="missing" if token is None else "invalid or expired"):
                client = self.app.test_client(use_cookies=False)
                response = client.get("/api/check", headers={"Cookie": f"access_token={token}"} if token else {})
                self.assertEqual(response.status_code, 401)
                self.assertIn("Expires=Thu, 01 Jan 1970 00:00:00 GMT", response.headers["Set-Cookie"])
                self.assertNotIn("Domain=", response.headers["Set-Cookie"])


if __name__ == "__main__":
    unittest.main()
