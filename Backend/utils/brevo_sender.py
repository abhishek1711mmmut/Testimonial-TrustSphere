"""Brevo HTTPS transport; no SMTP connection or additional package required."""

import json
import os
from urllib.error import HTTPError
from urllib.request import Request, urlopen


def send_brevo_email(subject, recipient, body, reply_to=None, html_body=None):
    api_key = os.getenv("BREVO_API_KEY", "").strip()
    sender_email = os.getenv("BREVO_SENDER_EMAIL", "").strip()
    if not api_key or not sender_email:
        raise ValueError("Brevo API key and sender email are required")

    payload = {
        "sender": {
            "email": sender_email,
            "name": os.getenv("BREVO_SENDER_NAME", "TrustSphere"),
        },
        "to": [{"email": recipient}],
        "subject": subject,
        "textContent": body,
    }
    if reply_to:
        payload["replyTo"] = {"email": reply_to}
    if html_body is not None:
        payload["htmlContent"] = html_body

    request = Request(
        "https://api.brevo.com/v3/smtp/email",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "api-key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        method="POST",
    )
    # Do not retry or fall back automatically: a timeout can occur after acceptance.
    try:
        with urlopen(request, timeout=10) as response:
            result = json.loads(response.read())
            if response.status != 201 or not result.get("messageId"):
                raise RuntimeError("Brevo did not confirm email acceptance")
    except HTTPError as error:
        status = error.code
        if error.fp is not None:
            error.close()
        raise RuntimeError("Brevo rejected email (HTTP %s)" % status) from None
