from flask import current_app, jsonify, request
from server.gpt.assistant_wrapper import AssistantWrapper

from server.gpt.utils import format_response
from . import gpt_blueprint
from .services import store_feedback, retrieve_feedback

@gpt_blueprint.route('/pragmatics/maxims', methods=['GET'])
def generate_pragmatics_maxims():
    topic = 'maxims'
    instruction ="""You do not need to use any upload files. Generate 5 new questions that test a student's understanding of Gricean Maxims and in particular how a given phrase can "opt out" of a specific manner or how a given phrase violates a particular maxim. This phrase should be in response in a conversation so generate what speaker 1 said and what speaker 2 said to opt out or violate a maxim. This should focus on the student being able to identify which maxim got violated from the provided phrase. Only generate in the format below
Example Response Format, include curly braces for json formatting:
{
"question": "What is the primary function of...",
"choices": ["A. Option One", "B. Option Two", "C. Option Three", "D. Option Four"],
"correctAnswer": "B",
"explanation": "Option B is correct because..."
}
"""

    response = AssistantWrapper.make_call(topic,instruction)

    print(response.data[0].content[0].text.value)

    return jsonify(response.data[0].content[0].text.value)


@gpt_blueprint.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    # Extract feedback from request and store it
    topic_id = request.json.get('topic_id')
    text = request.json.get('text')
    store_feedback(topic_id, text)
    return jsonify(success=True)
