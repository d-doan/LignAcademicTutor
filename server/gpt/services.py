from server.models.models import Feedback
from server.extensions import db

def store_feedback(topic_id, text):
    feedback = Feedback(topic_id=topic_id, text=text)
    db.session.add(feedback)
    db.session.commit()

def retrieve_feedback(topic_id):
    feedbacks = Feedback.query.filter_by(topic_id=topic_id).all()
    return " ".join(feedback.text for feedback in feedbacks)
