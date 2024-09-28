# from flask import Blueprint, jsonify, request
# from flask_jwt_extended import jwt_required, get_jwt_identity

# from config.database import mysql

# upgrade_plan_bp = Blueprint('upgrade_plan', __name__, url_prefix='/upgrade-plan')

# @upgrade_plan_bp.route('/upgrade-plan', methods=['POST'])
# @jwt_required()
# def upgrade_plan():
#     user_id = get_jwt_identity()  # Get user identity from JWT token
#     cursor = mysql.connection.cursor()

#     # Check if the user is already on the premium plan
#     cursor.execute("SELECT plan_id FROM users WHERE id = %s", (user_id,))
#     user_plan = cursor.fetchone()

#     if user_plan['plan_id'] == 2:  # Check if already on Premium Plan
#         return jsonify({
#             "success": False,
#             "message": "You are already on the Premium Plan."
#         }), 400

#     # Upgrade to premium (assuming plan_id 2 is premium)
#     cursor.execute("UPDATE users SET plan_id = 2 WHERE id = %s", (user_id,))
#     mysql.connection.commit()

#     return jsonify({
#         "success": True,
#         "message": "Plan upgraded successfully!"
#     }), 200


# # Example pseudo code for payment webhook
# @upgrade_plan_bp.route('/payment-success', methods=['POST'])
# def handle_payment_success():
#     data = request.get_json()
#     user_id = data['user_id']
#     cursor = mysql.connection.cursor()
#     # If payment is successful, upgrade the plan
#     cursor.execute("UPDATE users SET plan_id = 2 WHERE id = %s", (user_id,))
#     mysql.connection.commit()
    
#     return jsonify({"message": "Plan upgraded successfully!"}), 200

