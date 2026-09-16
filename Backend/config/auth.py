"""First-party JWT cookies served through the Next.js API proxy."""
import os
from datetime import timedelta

from flask import jsonify
from flask_jwt_extended import JWTManager, unset_access_cookies


def init_auth(app):
    app.config.update(
        JWT_TOKEN_LOCATION=["cookies"],
        JWT_ACCESS_COOKIE_NAME="access_token",
        JWT_ACCESS_COOKIE_PATH="/",
        JWT_COOKIE_DOMAIN=None,
        JWT_COOKIE_SAMESITE="Lax",
        JWT_COOKIE_SECURE=os.getenv(
            "JWT_COOKIE_SECURE",
            "true" if os.getenv("FLASK_ENV") == "production" else "false",
        ).lower() == "true",
        JWT_COOKIE_CSRF_PROTECT=False,
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=3),
    )
    jwt = JWTManager(app)

    def reject_session(message):
        response = jsonify(success=False, message=message)
        response.status_code = 401
        # Clear unusable cookies so middleware cannot bounce back to dashboard.
        unset_access_cookies(response)
        return response

    @jwt.expired_token_loader
    def expired_token(_header, _payload):
        return reject_session("Your session expired. Please sign in again.")

    @jwt.invalid_token_loader
    def invalid_token(_reason):
        return reject_session("Invalid session. Please sign in again.")

    @jwt.unauthorized_loader
    def missing_token(_reason):
        return reject_session("Please sign in to continue.")

    return jwt
