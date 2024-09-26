from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.space_services import create_space_logic, delete_space_logic, edit_space_logic

bp = Blueprint('space', __name__, url_prefix='/space')

# Route for creating a space, accessible only by authorized users
@bp.route('/create', methods=['POST'])
@jwt_required()  # Protecting the route with JWT
def create_space():
    # Call the service layer to create the space
    return create_space_logic()



# Route for deleting a space
@bp.route('/delete/<int:space_id>', methods=['DELETE'])
@jwt_required()  # Only authorized users
def delete_space(space_id):
    # Call the service layer to delete the space
    return delete_space_logic(space_id)



# Route for editing a space
@bp.route('/edit/<int:space_id>', methods=['PUT'])
@jwt_required()  # Only authorized users
def edit_space(space_id):
    current_user_id = get_jwt_identity()  # Get the current user ID from JWT
    space_data = request.get_json()  # Get data from the request body
    # Call the service layer to edit the space
    return edit_space_logic(space_data, current_user_id)