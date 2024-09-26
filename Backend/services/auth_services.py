from flask import jsonify, request
from flask_jwt_extended import create_access_token
from config.database import mysql
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