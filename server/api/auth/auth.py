from flask import Blueprint, render_template, redirect, request, url_for, flash
from server.models.models import User, db
from flask_login import login_user

auth = Blueprint('auth', __name__)

# Define Auth routes below

# user registration
@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Extract data from form
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        # Create new user object
        user = User(username=username, email=email)
        user.password = password  # This will hash the password
        db.session.add(user)
        db.session.commit()

        flash('Registration successful.')
        return redirect(url_for('auth.login'))

    return render_template('register.html')

# user login
@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()
        if user is not None and user.verify_password(password):
            login_user(user)
            return redirect(url_for('auth.login_success'))  # Redirect to the main page of your app

        flash('Invalid username or password.')

    return render_template('login.html')

# Render the login success page
@auth.route('/login-success')
def login_success():
    return render_template('login-success.html')
