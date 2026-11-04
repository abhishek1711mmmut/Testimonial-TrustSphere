from flask_mail import Mail, Message
import logging
import os

from utils.brevo_sender import send_brevo_email
from utils.email_templates import branded_email_html

logger = logging.getLogger(__name__)

mail=Mail()
def init_mail(app):
    mail.init_app(app)

def send_email(subject, recipient, body, reply_to=None, html_body=None):
    """
    Send through the selected provider while preserving the callers' contract.

    Args:
        subject (str): The subject of the email.
        recipient (str): Recipient's email address.
        body (str): Body of the email.
    """
    try:
        html_body = html_body if html_body is not None else branded_email_html(subject, body)
        provider = os.getenv('MAIL_PROVIDER', 'smtp').strip().lower()
        if provider == 'brevo':
            send_brevo_email(subject, recipient, body, reply_to=reply_to, html_body=html_body)
            return {"success": True, "message": "Email sent successfully."}
        if provider != 'smtp':
            raise ValueError('Unsupported mail provider')
        msg = Message(
            subject, 
            sender=os.getenv('MAIL_USERNAME'),
            recipients=[recipient],
            reply_to=reply_to)
        msg.body = body
        msg.html = html_body
        mail.send(msg)
        return {"success": True, "message": "Email sent successfully."}
    except Exception as e:
        # Never log provider responses, credentials, OTPs, or message content.
        logger.error("Email delivery failed (%s)", type(e).__name__)
        return {"success": False, "message": "Failed to send email."}
