from flask_mail import Mail, Message
import os

mail=Mail()
def init_mail(app):
    mail.init_app(app)

def send_email(subject, recipient, body):
    """
    Sends an email using Flask-Mail.

    Args:
        subject (str): The subject of the email.
        recipient (str): Recipient's email address.
        body (str): Body of the email.
    """
    try:
        msg = Message(
            subject, 
            sender=os.getenv('MAIL_USERNAME'),
            recipients=[recipient])
        msg.body = body
        mail.send(msg)
        return {"success": True, "message": "Email sent successfully."}
    except Exception as e:
        print(f"Error sending email: {e}")
        return {"success": False, "message": "Failed to send email."}
