from flask import Blueprint, render_template, redirect, request, url_for, flash
from server.models.models import RegistrationCode, User, db
from flask_login import current_user, login_user, logout_user

auth = Blueprint('auth', __name__)

# Define Auth routes below

# user registration
@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':

        registration_code = request.form.get('registration_code')
        code = RegistrationCode.query.filter_by(code=registration_code, is_used=False).first()
        if not code:
            flash('Invalid or used registration code.')
            return redirect(url_for('auth.register'))

        # Extract data from form
        username = request.form.get('username')
        password = request.form.get('password')

        # Create new user object
        user = User(username=username)
        user.password = password  # This will hash the password
        user.role = "instructor"

        code.is_used = True

        db.session.add(user)
        db.session.commit()

        flash('Registration successful.')
        return redirect(url_for('auth.login'))

    return render_template('register.html')

# user login
@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return render_template('already_logged_in.html')

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()
        if user is not None and user.verify_password(password):
            login_user(user)
            return redirect(url_for('auth.login_success'))  # Redirect to the main page of your app

        flash('Invalid username or password.')

    return render_template('login.html')

# Render the login success page
@auth.route('/login-success')
def login_success():
    return render_template('login-success.html')

@auth.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return redirect(url_for('auth.login'))  # Redirect to the login page after logout
