import os
import click
from dotenv import load_dotenv
from flask import Flask, current_app, jsonify
from flask_login import LoginManager
from flask.cli import with_appcontext

from server.gpt.assistant_wrapper import AssistantWrapper

from .api.auth.auth import auth
from .api.admin.admin import admin
from .main.main import main
from .extensions import db
from .gpt import gpt_blueprint

def create_app():
    load_dotenv()

    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'default_key')
    app.config['OPENAI_API_KEY'] = os.environ.get('OPEN_AI_API_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lignacademictutor.db'
    # app.config['SESSION_COOKIE_NAME'] = 'LIGN101SESSION'
    app.config['SESSION_COOKIE_SECURE'] = False  # Set to True if using HTTPS
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # or 'None' if necessary, 'True' to ensure HTTP only (not backend?)

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

    @app.route('/test')
    def test_route():
        return jsonify(message="Flask is connected!")

    # Register routes through blueprints
    app.register_blueprint(auth, url_prefix="/auth")
    app.register_blueprint(admin, url_prefix="/admin")
    app.register_blueprint(main, url_prefix="/")
    app.register_blueprint(gpt_blueprint, url_prefix="/gpt")

    with app.app_context():
        db.create_all()  # Create tables
        assistant = AssistantWrapper(api_key=current_app.config["OPENAI_API_KEY"]) # create assistant singleton
        app.assistant = assistant


    # SETUP FOR ADMIN ACCNT
    @app.cli.command('create-admin')
    @click.argument('username')
    @click.argument('password')
    @with_appcontext
    def create_admin(username, password):
        """Creates an admin user."""
        if User.query.filter_by(username=username).first():
            click.echo('Admin user already exists.')
            return

        admin_user = User(username=username, role='admin')
        admin_user.password = password
        db.session.add(admin_user)
        db.session.commit()
        click.echo('Admin user created successfully.')

    return app
