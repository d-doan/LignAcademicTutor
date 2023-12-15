from server.models.models import Feedback
from server.extensions import db

def store_feedback(topic_id, feedback_messages):
    new_feedback = Feedback(topic_id=topic_id, feedback_messages=feedback_messages)
    db.session.add(new_feedback)
    db.session.commit()
    return new_feedback

def retrieve_feedback(topic_id):
    feedback = Feedback.query.filter_by(topic_id=topic_id).all()
    return feedback

def update_feedback(feedback_id, new_feedback_messages):
    feedback = Feedback.query.get(feedback_id)
    if feedback:
        feedback.feedback_messages = new_feedback_messages
        db.session.commit()
        return feedback
    else:
        return None

def remove_feedback(feedback_id):
    feedback = Feedback.query.get(feedback_id)
    if feedback:
        db.session.delete(feedback)
        db.session.commit()
        return True
    else:
        return False

def get_feedback_for_gpt(topic_id):
    feedback_objects = retrieve_feedback(topic_id)
    formatted_feedback_messages = []
    for feedback in feedback_objects:
        # Assuming each feedback is a simple string message
        formatted_message = {"role": "user", "content": feedback.feedback_messages}
        formatted_feedback_messages.append(formatted_message)
    return formatted_feedback_messages
