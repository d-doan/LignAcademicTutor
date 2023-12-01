from flask import Blueprint, render_template, redirect, request, url_for, flash, jsonify
from server.models.models import RegistrationCode, User, db
from flask_login import current_user, login_user, logout_user

auth = Blueprint('auth', __name__)

# Define Auth routes below

# user registration
@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':

        # Check if request is from JSON (from React app)
        if request.is_json:
            data = request.get_json()
            registration_code = data.get('code')
            username = data.get('username')
            password = data.get('password')
        else:
            # Handle form data (from traditional form submission)
            registration_code = request.form.get('registration_code')
            username = request.form.get('username')
            password = request.form.get('password')

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

    return render_template('register.html')

# user login
@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return render_template('already_logged_in.html')

    if request.method == 'POST':
        # Check if the request is JSON (from React app)
        if request.is_json:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
        else:
            # Handle form data (from traditional form submission)
            username = request.form.get('username')
            password = request.form.get('password')

        user = User.query.filter_by(username=username).first()

        # Check valid login
        if user is not None and user.verify_password(password):
            login_user(user)
            message = 'Login successful.'
            if request.is_json:
                return jsonify({'message': message}), 200
            else:
                return redirect(url_for('auth.login_success'))  # Adjust this to your main page

        # Invalid login
        message = 'Invalid username or password.'
        if request.is_json:
            return jsonify({'error': message}), 401
        else:
            flash(message)
            return redirect(url_for('auth.login'))

    return render_template('login.html')

# Render the login success page
@auth.route('/login-success')
def login_success():
    return render_template('login-success.html')

# Logout
@auth.route('/logout', methods=['POST'])
def logout():
    logout_user()
    if request.is_json:
        return jsonify({'message': 'Logged out successfully'}), 200
    else:
        return redirect(url_for('auth.login'))  # Redirect to the login page after logout

# Get current user data
@auth.route('/current-user')
def get_current_user():
    if current_user.is_authenticated:
        return jsonify(username=current_user.username)
    return jsonify(error='Not logged in'), 401