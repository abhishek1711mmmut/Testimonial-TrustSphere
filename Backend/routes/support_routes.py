from flask import Blueprint
from services.support_services import send_support_message

bp = Blueprint("support", __name__, url_prefix="/api/support")


@bp.route("/contact", methods=["POST"])
def contact():
    return send_support_message()


@bp.after_request
def disable_caching(response):
    response.headers["Cache-Control"] = "no-store"
    return response
