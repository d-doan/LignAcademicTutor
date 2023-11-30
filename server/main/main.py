from flask import Blueprint, render_template, redirect, request, session, url_for, flash
from server.models.models import RegistrationCode, User, db
from flask_login import current_user, login_user, logout_user

main = Blueprint('main', __name__)

# Define main routes below

@main.route('/')
def home():
    return render_template('home.html')


@main.route('/question')
def question():
    return render_template('question.html')

@main.route('/choose/<choice>')
def choose(choice):
    if 'choices' not in session:
        session['choices'] = []

    session['choices'].append(choice)
    session.modified = True  # Mark the session as modified
    return redirect(url_for('main.show_choices'))

@main.route('/choices')
def show_choices():
    choices = session.get('choices', [])
    return render_template('choices.html', choices=reversed(choices))

@main.route('/reset')
def reset():
    session.pop('choices', None)  # Remove 'choices' from session
    return redirect(url_for('main.question'))

