import os
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'default_key')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lignacademictutor.db'

    db.init_app(app)

    # Define routes below
    @app.route('/test')
    def test_route():
        return jsonify(message="Flask is connected!")

    with app.app_context():
        db.create_all()  # Create tables

    return app
