from flask import Blueprint
from flask_jwt_extended import jwt_required
from services.space_services import create_space_logic, delete_space_logic, edit_space_logic, get_spaces_logic

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
    # Call the service layer to edit the space
    return edit_space_logic(space_id)



# Route for getting all spaces of a user
@bp.route('/spaces', methods=['GET'])
@jwt_required()  # Only authorized users
def get_spaces():
    # Call the service layer to get all spaces
    return get_spaces_logic()