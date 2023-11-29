import os
from flask import Flask, jsonify
from flask_login import LoginManager
from .api.auth.auth import auth
from .extensions import db
from .models.models import User


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'default_key')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lignacademictutor.db'

    db.init_app(app)

    # Initialize Flask-Login
    login_manager = LoginManager()
    login_manager.init_app(app)

    # Configure the login manager
    login_manager.login_view = 'auth.login'  # Set the view name for the login route
    login_manager.login_message = 'Please log in to access this page.'

    # Define the user_loader function to load users from the database
    from .models.models import User  # Import your User model
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Define routes below

    @app.route('/')
    def home():
        return 'Welcome to the home page'

    @app.route('/test')
    def test_route():
        return jsonify(message="Flask is connected!")

    # Register routes through blueprints

    app.register_blueprint(auth, url_prefix='/auth')

    with app.app_context():
        db.create_all()  # Create tables

    return app
