from html import escape


def branded_email_html(title, body, code=None):
    """Render email-safe inline styles and escape all dynamic text."""
    code_block = ""
    if code is not None:
        code_block = (
            '<p style="margin:24px 0;padding:20px;background:#edf5ff;'
            'border:1px solid #c7dbff;border-radius:12px;text-align:center;'
            'font-family:monospace;font-size:36px;font-weight:700;'
            'letter-spacing:8px;color:#006bff;">'
            f'{escape(str(code))}</p>'
            '<p style="font-size:14px;color:#64748b;">Valid for 10 minutes. '
            'Keep this code private and never share it with anyone.</p>'
        )
    paragraphs = "".join(
        '<p style="margin:0 0 16px;line-height:1.7;overflow-wrap:anywhere;">'
        + escape(part).replace("\n", "<br>") + '</p>'
        for part in body.split("\n\n")
    )
    footer = "Sent by TrustSphere"
    if code is not None:
        footer = "If you didn't request this code, you can safely ignore this email.<br>" + footer
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(title)}</title></head>
<body style="margin:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#334155;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;">
<tr><td style="padding:26px 28px;background:#101423;border-radius:16px 16px 0 0;">
<p style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">TrustSphere<span style="color:#6ee7b7;">.</span></p>
<p style="margin:6px 0 0;color:#cbd5e1;font-size:13px;">Customer stories. Lasting trust.</p>
</td></tr>
<tr><td style="padding:28px;">
<h1 style="margin:0 0 18px;color:#101423;font-size:24px;line-height:1.3;">{escape(title)}</h1>
{paragraphs}{code_block}
</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.6;">
{footer}</td></tr>
</table></td></tr></table></body></html>'''


def otp_email_html(otp):
    return branded_email_html(
        "Verify your email",
        "Welcome to TrustSphere!\n\nEnter the verification code below to finish signing up.",
        code=otp,
    )


def otp_email_body(otp):
    return f"Your OTP for signup verification is: {otp}\nIt will expire in 10 minutes."

def registration_success_body(username):
    return f"Hi {username},\nWelcome to our platform! Your registration was successful."

def plan_upgrade_body(username, plan_name):
    return (
        f"Hi {username},\n"
        f"Your plan has been successfully upgraded to {plan_name}.\n"
        "Thank you for choosing our service!"
    )
