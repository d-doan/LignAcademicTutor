from server.app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)  # Store hashed passwords
    email = db.Column(db.String(120), unique=True, nullable=False)
    # Since all users are instructors, we don't need a 'role' field here.

class Topic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topic.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)  # e.g., "Identify the correct syntax tree"
    custom_prompt = db.Column(db.Text, nullable=True)  # Additional prompting
    # may add difficulty level or type
