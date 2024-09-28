from flask import Blueprint
from flask_jwt_extended import jwt_required
from services.testimonial_services import create_testimonial_logic, get_all_testimonials_by_spaceId_logic, delete_testimonial_logic

bp = Blueprint('testimonial', __name__, url_prefix='/testimonial')

@bp.route('/create', methods=['POST'])
def create_testimonial():
    return create_testimonial_logic()



@bp.route('/space/<int:space_id>/testimonials', methods=['GET'])
@jwt_required()  # Ensure that the user is authorized
def get_testimonials(space_id):
    return get_all_testimonials_by_spaceId_logic(space_id)



@bp.route('/delete/<int:testimonial_id>/<int:space_id>', methods=['DELETE'])
@jwt_required()  # Ensure that the user is authorized
def delete_testimonial(testimonial_id, space_id):
    return delete_testimonial_logic(testimonial_id, space_id)