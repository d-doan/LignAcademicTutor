from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from ..extensions import db

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(10), default='student') # differentiates between instructor and admin

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role == 'admin'

class Topic(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.String(100), db.ForeignKey('topic.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)  # e.g., "Identify the correct syntax tree"
    custom_prompt = db.Column(db.Text, nullable=True)  # Additional prompting

class RegistrationCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(100), unique=True, nullable=False)
    is_used = db.Column(db.Boolean, default=False)

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.String(100), db.ForeignKey('topic.id'), nullable=False)
    feedback_messages = db.Column(db.JSON, nullable=False)

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.String(100), db.ForeignKey('topic.id'), nullable=False)
    question_content = db.Column(db.Text, nullable=False)  # Store the question text directly
    content = db.Column(db.Text, nullable=False)  # The content of the report
    is_resolved = db.Column(db.Boolean, default=False)  # To track if the report has been addressed
