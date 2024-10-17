from flask import jsonify, request
from flask_jwt_extended import create_access_token
from config.database import mysql
from utils.email_templates import otp_email_body
from utils.mailSender import send_email
import random
import bcrypt

def signup_logic():
    first_name = request.json.get('firstName')
    last_name = request.json.get('lastName')
    email = request.json.get('email')
    password = request.json.get('password')
    
    if not first_name or not last_name or not email or not password:
        return jsonify({"message": "Missing fields", "success": "false"}), 400
    
    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Call the model function to create the user
    try:
        # check if user already exists
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if user:
            return jsonify({"message": "User already exists", "success": "false"}), 400     
        # create user
        cursor.execute(
            """INSERT INTO users (firstName, lastName, email, password) 
            VALUES (%s, %s, %s, %s)""",
            (first_name,last_name, email, hashed_password)
        )
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "User created successfully", "success": "true"}), 201
    except Exception as e:
        return jsonify({"message": "Unable to create user", "success": "false", "error": str(e)}), 500


def login_logic():
    email = request.json.get('email')
    password = request.json.get('password')
    
    if not email or not password:
        return jsonify({"message": "Missing fields", "success": "false"}), 400

    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return jsonify({"message": "User not registered", "success": "false"}), 404
        cursor.close()
        check_password = bcrypt.checkpw(password.encode('utf-8'), user[4].encode('utf-8'))
        if not user or not check_password:
            return jsonify({"message": "Invalid credentials", "success": "false"}), 401     
        # Create JWT token
        access_token = create_access_token(identity=user[0])     
        return jsonify({"access_token": access_token, "success": "true", "message": "Login successful"}), 200
    except Exception as e:
        return jsonify({"message": "Unable to login", "success": "false", "error": str(e)}), 500    
    


def send_otp_logic():
    email = request.json.get('email')
    
    if not email:
        return jsonify({"message": "Missing email", "success": "false"}), 400
    
    try:
        # # check previous otp from that email
        # cursor.execute(
        #     """SELECT * FROM otp WHERE email = %s""",
        #     (email,)
        # )
        # oldOtp = cursor.fetchone()
        # # if previous otp presence, then delete it
        # if(oldOtp):
        #     cursor.execute(
        #         """DELETE FROM otp WHERE email = %s""",
        #         (email,)
        #     )
        # # Generate OTP
        # otp = random.randint(100000, 999999)
        # # Insert OTP into otp schema
        # cursor.execute(
        #     """INSERT INTO otp (email, otp_code)
        #     VALUES (%s, %s)""",
        #     (email, otp)
        # )
        otp_code = f"{random.randint(100000, 999999)}"
        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO otp (email, otp_code) VALUES (%s, %s) "
            "ON DUPLICATE KEY UPDATE otp_code = %s, created_at = CURRENT_TIMESTAMP",
            (email, otp_code, otp_code)
        )
        mysql.connection.commit()
        cursor.close()
        # Send OTP via email
        body = otp_email_body(otp_code)
        email_response=send_email("OTP Verification", email, body)
        if not email_response["success"]:
            return jsonify(email_response), 500
        return jsonify({"message": "OTP sent successfully", "success": "true"}), 200
    except Exception as e:
        return jsonify({"message": "Unable to send OTP", "success": "false", "error": str(e)}), 500


def verify_otp_logic(email, otp):
    # email = request.json.get('email')
    # otp = request.json.get('otp')
    
    if not email or not otp:
        return jsonify({"message": "Missing fields", "success": "false"}), 400
    
    try:
        cursor = mysql.connection.cursor()
        # Check if OTP is valid
        cursor.execute("SELECT otp_code FROM otp WHERE TIMESTAMPDIFF(MINUTE, created_at, NOW()) <= 10 AND email = %s", (email,))
        otp_from_db = cursor.fetchone()[0]
        if otp != otp_from_db:
            return jsonify({"message": "Invalid OTP", "success": "false"}), 400
        mysql.connection.commit()
        cursor.close()
        return jsonify({"message": "OTP verified successfully", "success": "true"}), 200
    except Exception as e:
        return jsonify({"message": "Unable to verify OTP", "success": "false", "error": str(e)}), 500