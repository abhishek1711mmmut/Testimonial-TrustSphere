from flask import Blueprint
from services.embed_services import render_wall_of_love, render_single_testimonial

bp = Blueprint('embed', __name__)

@bp.route('/embed/<int:space_id>')
def wall_of_love(space_id):
    return render_wall_of_love(space_id)

@bp.route('/embed/<int:space_id>/testimonial/<int:testimonial_id>')
def single_testimonial(space_id, testimonial_id):
    return render_single_testimonial(space_id, testimonial_id)
