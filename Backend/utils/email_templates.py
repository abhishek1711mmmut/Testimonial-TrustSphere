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
