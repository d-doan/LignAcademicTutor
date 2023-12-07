# server/gpt/__init__.py
from flask import Blueprint

gpt_blueprint = Blueprint('gpt', __name__)

from . import endpoints
