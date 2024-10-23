from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from config import database
from datetime import timedelta
from utils.mailSender import init_mail
from flask_cors import CORS
import os

# Load environment variables
load_dotenv()

# Create app instance
app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}}, supports_credentials=True)

# Configure app
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=12)
app.config['CORS_HEADERS'] = 'Content-Type'
# Configure Flask-Mail with your email settings
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
# Initialize Mail
init_mail(app)

# Initialize the db
database.init_db(app)
# Configure JWT
jwt = JWTManager(app)



# Import routes
from routes import auth_routes as auth, space_routes as space, testimonial_routes as testimonial
app.register_blueprint(auth.bp)
app.register_blueprint(space.bp)
app.register_blueprint(testimonial.bp)

# create a simple "/" route that print welcome message
@app.route('/api')
def hello_world():
    return jsonify({"message": "Welcome to the TrustSphere Backend"})

if __name__ == '__main__':
    app.run(debug=True)