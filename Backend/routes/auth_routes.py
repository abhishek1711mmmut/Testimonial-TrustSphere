from flask import Blueprint
from flask_jwt_extended import jwt_required
from services.auth_services import signup_logic, login_logic, send_otp_logic, logout_logic, get_user_logic

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/signup', methods=['POST'])
def signup():
    # Call the service layer to create the user
    return signup_logic()
    

@bp.route('/login', methods=['POST'])
def login():
    # Call the service layer to login the user
    return login_logic()


@bp.route('/send-otp', methods=['POST'])
def send_otp():
    return send_otp_logic()


@bp.route('/logout', methods=['GET'])
@jwt_required()
def logout():
    return logout_logic()


@bp.route('/user', methods=['GET'])
@jwt_required()
def getUser():
    return get_user_logic()