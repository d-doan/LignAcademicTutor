import uuid
from flask import Blueprint, jsonify, render_template, redirect, request, url_for, flash
from server.models.models import RegistrationCode, User, db
from flask_login import current_user, login_user

admin = Blueprint('admin', __name__)

# Define admin routes below

# admin commands

@admin.route('/generate_code', methods=['GET', 'POST'])
def generate_code():
    if not current_user.is_admin():
        return 'Unauthorized', 403

    if request.method == 'POST':
        new_code = str(uuid.uuid4())  # Generates a unique code
        code = RegistrationCode(code=new_code)
        db.session.add(code)
        db.session.commit()
        flash('New registration code generated.')
        return redirect(url_for('admin.generate_code'))

    codes = RegistrationCode.query.all()
    # Convert the 'codes' data to JSON format and return it
    code_data = [{'code': code.code, 'is_used': code.is_used} for code in codes]
    return jsonify(code_data)
