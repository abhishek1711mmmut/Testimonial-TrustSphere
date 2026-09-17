"""Public contact form: validate, throttle across workers, then email the author."""
import hashlib
import json
import re
import time

from flask import current_app, jsonify, request
from config.database import mysql
from utils.mailSender import send_email

MAX_BODY_BYTES = 64 * 1024
WINDOW_SECONDS = 15 * 60
EMAIL_PATTERN = re.compile(r"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}")


def reserve_send(email):
    """Atomically reserve capacity in a global and per-email fixed window.

    Counters live in MySQL, so restarts and multiple workers share the limits.
    Always lock the global bucket first to keep concurrent lock order consistent.
    Failed SMTP attempts still consume capacity to limit repeated send attempts.
    """
    now = int(time.time())
    window = now - now % WINDOW_SECONDS
    buckets = [("global", 30), (hashlib.sha256(email.lower().encode()).hexdigest(), 3)]
    connection = mysql.connection
    cursor = connection.cursor()
    try:
        for key, limit in buckets:
            cursor.execute(
                "INSERT INTO support_rate_limits (bucket_key, window_start, attempts) "
                "VALUES (%s, %s, 1) ON DUPLICATE KEY UPDATE attempts = attempts + 1",
                (key, window),
            )
            cursor.execute(
                "SELECT attempts FROM support_rate_limits WHERE bucket_key = %s "
                "AND window_start = %s FOR UPDATE", (key, window),
            )
            if cursor.fetchone()[0] > limit:
                connection.rollback()
                return window + WINDOW_SECONDS - now
        cursor.execute("DELETE FROM support_rate_limits WHERE window_start < %s", (window - 86400,))
        connection.commit()
        return 0
    except Exception:
        connection.rollback()
        raise
    finally:
        cursor.close()


def send_support_message():
    if not request.is_json:
        return jsonify(success=False, message="Send the form as JSON."), 415
    if request.content_length and request.content_length > MAX_BODY_BYTES:
        return jsonify(success=False, message="Your message is too large."), 413
    raw = request.stream.read(MAX_BODY_BYTES + 1)
    if len(raw) > MAX_BODY_BYTES:
        return jsonify(success=False, message="Your message is too large."), 413
    try:
        data = json.loads(raw)
    except (ValueError, UnicodeDecodeError):
        return jsonify(success=False, message="Invalid form data."), 400
    if not isinstance(data, dict):
        return jsonify(success=False, message="Invalid form data."), 400

    # A field hidden from people catches basic form-filling bots without sending mail.
    if data.get("website"):
        return jsonify(success=False, message="Unable to submit this form."), 400

    errors = {}
    fields = {}
    for field, label, limit in [("name", "Name", 100), ("email", "Email", 254),
                                 ("subject", "Subject", 150), ("message", "Message", 5000),
                                 ("phone", "Phone number", 30)]:
        value = data.get(field, "")
        if not isinstance(value, str):
            errors[field] = f"{label} must be text."
            value = ""
        fields[field] = value.strip()
        if field != "phone" and not fields[field]:
            errors[field] = f"{label} is required."
        elif len(value) > limit:
            errors[field] = f"{label} must be {limit} characters or fewer."
        elif any(ord(c) < 32 and c not in ("\n", "\r", "\t") for c in value):
            errors[field] = f"{label} contains invalid characters."
        elif field != "message" and any(c in value for c in "\r\n\t"):
            errors[field] = f"{label} must be on a single line."

    email = fields["email"]
    local_part = email.split("@", 1)[0]
    if email and (not EMAIL_PATTERN.fullmatch(email) or len(local_part) > 64
                  or local_part.startswith(".") or local_part.endswith(".") or ".." in local_part):
        errors["email"] = "Enter a valid email address."
    phone = fields["phone"]
    if phone and (not re.fullmatch(r"[+0-9() .-]+", phone) or not 7 <= sum(c.isdigit() for c in phone) <= 15):
        errors["phone"] = "Enter a valid phone number, including country code if needed."
    if data.get("consent") is not True:
        errors["consent"] = "Please agree to being contacted about your message."
    if errors:
        return jsonify(success=False, message="Please check the highlighted fields.", errors=errors), 400

    try:
        retry_after = reserve_send(email)
        if retry_after:
            response = jsonify(success=False, message="Too many messages. Please try again later.")
            response.status_code = 429
            response.headers["Retry-After"] = str(retry_after)
            return response
        body = (
            "A visitor sent a message through TrustSphere support.\n\n"
            f"Name: {fields['name']}\nEmail: {email}\n"
            f"Phone: {phone or 'Not provided'}\nSubject: {fields['subject']}\n\n"
            f"Message:\n{fields['message']}\n\n"
            "The visitor agreed to being contacted about this message.\n"
        )
        result = send_email(
            f"[TrustSphere Support] {fields['subject']}",
            current_app.config["SUPPORT_EMAIL"], body, reply_to=email,
        )
        if not result.get("success"):
            return jsonify(success=False, message="We could not send your message. Please try again later or email the author directly."), 503
        return jsonify(success=True, message="Your message has been sent. The author can reply to the email address you provided."), 200
    except Exception:
        current_app.logger.exception("Support submission failed")
        return jsonify(success=False, message="Support is temporarily unavailable. Please try again later or email the author directly."), 503
