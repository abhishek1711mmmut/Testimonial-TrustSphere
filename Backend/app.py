from flask import Flask, jsonify
from config.auth import init_auth
from dotenv import load_dotenv
from config import database
from utils.mailSender import init_mail
from flask_cors import CORS
import os


def _system_ca_path():
    """Return a common system CA bundle path for mysqlclient TLS verification."""
    for path in (
        os.getenv("MYSQL_SSL_CA"),
        "/etc/ssl/certs/ca-certificates.crt",  # Debian/Ubuntu and most Linux hosts
        "/etc/ssl/cert.pem",  # macOS and Alpine
    ):
        if path and os.path.isfile(path):
            return path
    return None

# Load environment variables
load_dotenv()

# Create app instance
app = Flask(__name__)

# Enable CORS
allowed_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(',')
CORS(app, resources={
    r"/api/*": {"origins": allowed_origins},
    r"/embed/*": {"origins": "*"},
}, supports_credentials=True)

# Configure app
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT', 3306))

if os.getenv('MYSQL_SSL', 'false').lower() == 'true':
    # TiDB Cloud Starter public endpoints require TLS. VERIFY_IDENTITY checks
    # both the certificate chain and that it belongs to MYSQL_HOST.
    ssl_options = {'ssl_mode': 'VERIFY_IDENTITY'}
    ca_path = _system_ca_path()
    if ca_path:
        ssl_options['ssl'] = {'ca': ca_path}
    app.config['MYSQL_CUSTOM_OPTIONS'] = ssl_options
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['CORS_HEADERS'] = 'Content-Type'
# Configure Flask-Mail with your email settings
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['SUPPORT_EMAIL'] = os.getenv('SUPPORT_EMAIL', 'abhishek002kvs@gmail.com')
# Initialize Mail
init_mail(app)

# Initialize the db
database.init_db(app)
# Configure JWT
jwt = init_auth(app)



# Import routes
from routes import auth_routes as auth, space_routes as space, testimonial_routes as testimonial, embed_routes as embed
from routes import support_routes as support
app.register_blueprint(auth.bp)
app.register_blueprint(space.bp)
app.register_blueprint(testimonial.bp)
app.register_blueprint(embed.bp)
app.register_blueprint(support.bp)

# create a simple "/" route that print welcome message
@app.route('/api')
def hello_world():
    return jsonify({"message": "Welcome to the TrustSphere Backend"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
