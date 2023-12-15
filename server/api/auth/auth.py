from flask import Blueprint, render_template, redirect, request, url_for, flash, jsonify, session
from server.models.models import RegistrationCode, User, db
from flask_login import current_user, login_user, logout_user

auth = Blueprint('auth', __name__)

# user registration
@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    registration_code = data.get('code')
    username = data.get('username')
    password = data.get('password')

    # Check registration code
    code = RegistrationCode.query.filter_by(code=registration_code, is_used=False).first()
    if not code:
        message = 'Invalid or used registration code.'
        if request.is_json:
            return jsonify({'error': message}), 400
        else:
            flash(message)
            return redirect(url_for('auth.register'))

    # Check if user exists
    if User.query.filter_by(username=username).first():
        message = 'User already exists.'
        if request.is_json:
            return jsonify({'error': message}), 409
        else:
            flash(message)
            return redirect(url_for('auth.register'))

    # Create new user object
    user = User(username=username)
    user.password = password  # This should hash the password
    user.role = "instructor"

    code.is_used = True

    db.session.add(user)
    db.session.commit()

    message = 'Registration successful.'
    if request.is_json:
        return jsonify({'message': message}), 201
    else:
        flash(message)
        return redirect(url_for('auth.login'))


# user login
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    # Check valid login
    if user and user.verify_password(password):
        login_user(user)
        message = 'Login successful. Returning now.'
        if request.is_json:
            return jsonify({'message': message}), 200
        else:
            return redirect(url_for('auth.login_success'))

    # Invalid login
    message = 'Invalid username or password.'
    if request.is_json:
        return jsonify({'error': message}), 401
    else:
        flash(message)
        return redirect(url_for('auth.login'))

# Logout
@auth.route('/logout', methods=['POST'])
def logout():
    logout_user()
    if request.is_json:
        return jsonify({'message': 'Logged out successfully'}), 200
    else:
        return redirect(url_for('auth.login'))

# Get current user data
@auth.route('/current-user', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify(username=current_user.username)
    return jsonify(error='Not logged in'), 401

# Submit instructor feedback
@auth.route('/feedback', methods=['GET', 'POST'])
def submit_feedback():
    if request.method == 'POST':
        return jsonify("Feedback Submitted!"), 200
    return jsonify("Error with submitting feedback"), 404
