from flask import Blueprint, render_template, redirect, request, url_for, flash
from server.models.models import RegistrationCode, User, db
from flask_login import current_user, login_user, logout_user

main = Blueprint('main', __name__)

# Define main routes below

@main.route('/')
def home():
    return render_template('home.html')
