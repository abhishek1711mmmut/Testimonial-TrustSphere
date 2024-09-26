from flask import Blueprint
from services.auth_services import signup_logic, login_logic

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/signup', methods=['POST'])
def signup():
    # Call the service layer to create the user
    return signup_logic()
    

@bp.route('/login', methods=['POST'])
def login():
    # Call the service layer to login the user
    return login_logic()