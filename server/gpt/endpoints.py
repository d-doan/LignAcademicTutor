import json
from flask import current_app, jsonify, request
from openai import OpenAI

from server.models.models import Question, Report
from server.extensions import db

from . import gpt_blueprint
from .feedback_service import get_feedback_for_gpt, remove_feedback, store_feedback, retrieve_feedback, update_feedback

SYSTEM_PROMPTS = [
    {"role": "system", "content": "You are a model that specializes in generating multiple choice questions (typically a,b,c,d unless specified) and providing feedback to students for LIGN 101, Introduction to the Study of Language."},
    {"role": "system", "content": "Generate in JSON format of id: 1, question: What is the primary function of..., choices: [A. Option One, B. Option Two, C. Option Three, D. Option Four], correctAnswer: B. Option Two, explanation: Option B is correct because..."}
]


@gpt_blueprint.route('/phonetics/transcription', methods=['GET'])
def generate_phonetics_transcription():
    client = OpenAI(api_key=current_app.config["OPENAI_API_KEY"])

    feedback_messages = get_feedback_for_gpt('transcription')
    messages_to_send = SYSTEM_PROMPTS + feedback_messages + [{"role": "user", "content": "This question will focus on Phonetic transcripions from typical American English. Can you generate 5 questions that provide an English word and 4 possible transcriptions for each of them. YOU MUST USE STANDARD AMERICAN ENGLISH IPA FOR THIS."}]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type":"json_object"},
        messages=messages_to_send
    )
    response_content = json.loads(response.choices[0].message.content)
    return jsonify(response_content)


@gpt_blueprint.route('/phonology/phonrules', methods=['GET'])
def generate_phonology_rules():
    client = OpenAI(api_key=current_app.config["OPENAI_API_KEY"])

    feedback_messages = get_feedback_for_gpt('phonrules')
    messages_to_send = SYSTEM_PROMPTS + feedback_messages + [{"role": "user", "content": "This question will focus on Phonemic rules. Can you generate an English description of a phonological rule and have the student identify the formal phonological rule as answer choices. Do not assume the student knows a particular American English Phonological rule but instead describe it such as Vowels become lengthened at the end of a word which the answer is /V/ -> [V:] / _# Adhere to IPA when doing this task. Can you generate 5 questions that provide an English word and 4 possible transcriptions for each of them. YOU MUST USE STANDARD AMERICAN ENGLISH IPA FOR THIS."}]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type":"json_object"},
        messages=messages_to_send
    )
    response_content = json.loads(response.choices[0].message.content)
    return jsonify(response_content)


@gpt_blueprint.route('/syntax/trees', methods=['GET'])
def generate_syntax_trees():
    client = OpenAI(api_key=current_app.config["OPENAI_API_KEY"])

    feedback_messages = get_feedback_for_gpt('trees')
    messages_to_send = SYSTEM_PROMPTS + feedback_messages + [{"role": "system", "content": "Use the abbreviations defined here to interpret the phase structure rules in the next instruction. NP=Noun Phrase,DET=Determiner,N=Nount,ADJ=Adjective,PP=Prepositional Phrase,P=Preposition,VP=Verb Phrase,V=Verb,CP=Complementizer Phrase,C=Complementizer,N'=Allows for recursive Adjective + Nouns"},
            {"role": "system", "content": "We are going to work with syntax trees, this requires phase structure rules. Only break sentences down using these rules. The rules are as follows: 1.NP->DET N' 2.NP->N' 3.N'->N 4.N'->ADJ N' 5.NP->NP PP 6.PP->P NP 7.S->NP VP 8.VP->V 9.VP->V NP 10.VP->V PP 11.VP->VP PP 12.VP->V CP 13.CP->C S"},
            {"role": "user", "content": "These questions aims to focus on a student's understanding of syntax trees using the aforementioned phase structure rules. Can you generate 5 questions that achieve this?"}]

    print(messages_to_send)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type":"json_object"},
        messages=messages_to_send
    )
    response_content = json.loads(response.choices[0].message.content)
    return jsonify(response_content)


@gpt_blueprint.route('/semantics/entailment', methods=['GET'])
def generate_semantics_entailment():
    client = OpenAI(api_key=current_app.config["OPENAI_API_KEY"])

    feedback_messages = get_feedback_for_gpt('entailment')
    messages_to_send = SYSTEM_PROMPTS + feedback_messages + [{"role": "user", "content": "This question focuses on a student being able to identify whether a sentence pair (X,Y) results in X entailing Y or X implying Y. An example is as follows - X: Nikola has small hands. Y: Nikola has hands which results in entailment. However if X: Nikola has hands Y: Nikola has small hands then this is not entailed. Generate 5 new questions that follow this example."}]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type":"json_object"},
        messages=messages_to_send
    )
    response_content = json.loads(response.choices[0].message.content)

    try:
        feedback_messages_json = json.loads(feedback_messages)
    except json.JSONDecodeError as e:
        # Log the error and the problematic string
        print(f"JSON decoding error: {e}")
        print(f"Invalid JSON content: {feedback_messages}")

        # You can decide how to handle the error, e.g., return an error response

    return jsonify(response_content)


@gpt_blueprint.route('/pragmatics/maxims', methods=['GET'])
def generate_pragmatics_maxims():
    client = OpenAI(api_key=current_app.config["OPENAI_API_KEY"])

    feedback_messages = get_feedback_for_gpt('maxims')
    messages_to_send = SYSTEM_PROMPTS + feedback_messages + [{"role": "user", "content": "This question focuses on a student being able to identify whether a given sentence results in the speaker opting out or violating a Gricean Maxim in the context of Pragmatics. You should generate a phrase and then have the answer choices as different Gricean maximums. As an example - I'm not at liberty to say any more than that is an example of the maxim of Quantity. Generate 5 new questions that follow this example."}]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type":"json_object"},
        messages=messages_to_send
    )
    response_content = json.loads(response.choices[0].message.content)
    return jsonify(response_content)


# FEEDBACK ENDPOINTS

@gpt_blueprint.route('/feedback', methods=['GET'])
def get_feedback():
    topic_id = request.args.get('topic_id')  # Retrieve the topic_id from the query parameter
    feedback = retrieve_feedback(topic_id)

    feedback_list = [feedback_item.to_dict() for feedback_item in feedback]

    print(feedback_list)

    return jsonify(feedback_list)

# Modify the route to use <topic_id> as a query parameter
@gpt_blueprint.route('/feedback/submit', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()
        topic_id = data.get('topic_id')
        feedback_text = data.get('feedback_text')
        
        # Process the data here
        
        return jsonify(success=True)
    except json.decoder.JSONDecodeError as e:
        # Handle JSON decoding error
        error_message = f"JSON decoding error: {str(e)}"
        return jsonify(success=False, error=error_message), 400
    except Exception as e:
        # Handle other exceptions
        return jsonify(success=False, error=str(e)), 500

# Modify the route to use <topic_id> as a query parameter
@gpt_blueprint.route('/feedback/edit', methods=['PUT'])
def edit_feedback():
    feedback_id = request.args.get('feedback_id')  # Retrieve the feedback_id from the query parameter
    new_feedback_text = request.json['feedback_text']
    update_feedback(feedback_id, new_feedback_text)
    return jsonify({"message": "Feedback updated successfully"})

# Modify the route to use <topic_id> as a query parameter
@gpt_blueprint.route('/feedback/delete', methods=['DELETE'])
def delete_feedback():
    feedback_id = request.args.get('feedback_id')  # Retrieve the feedback_id from the query parameter
    remove_feedback(feedback_id)
    return jsonify({"message": "Feedback deleted successfully"})


# REPORT ENDPOINTS

@gpt_blueprint.route('/report/submit', methods=['POST'])
def submit_report():
    data = request.json
    new_report = Report(
        question_id=data['question_id'],
        content=data['content']
    )
    db.session.add(new_report)
    db.session.commit()
    return jsonify({"message": "Report submitted successfully"})

@gpt_blueprint.route('/reports/<topic_id>', methods=['GET'])
def get_reports(topic_id):
    reports = Report.query.join(Question).filter(Question.topic_id == topic_id).all()
    reports_data = [{'id': report.id, 'content': report.content, 'question_id': report.question_id} for report in reports]
    return jsonify(reports_data)

@gpt_blueprint.route('/reports/unresolved/<topic_id>', methods=['GET'])
def get_unresolved_reports(topic_id):
    unresolved_reports = Report.query.join(Question).filter(Question.topic_id == topic_id, Report.is_resolved == False).all()
    reports_data = [{'id': report.id, 'content': report.content, 'question_id': report.question_id} for report in unresolved_reports]
    return jsonify(reports_data)


# Temporary endpoint for testing get_feedback_for_gpt
@gpt_blueprint.route('/test/get_feedback', methods=['GET'])
def test_get_feedback_for_gpt():
    topic_id = request.args.get('topic_id')  # You can pass the topic_id as a query parameter
    feedback = get_feedback_for_gpt(topic_id)  # Return the list of feedback messages

    if len(feedback) == 0:
        print("Empty")

    # Print the feedback messages to the console
    for feedback_item in feedback:
        print(feedback_item)

    return jsonify({"message": "Test completed"})

@gpt_blueprint.route('/test/add_feedback', methods=['POST'])
def test_add_feedback():
    data = request.json
    topic_id = data['topic_id']
    feedback_text = data['feedback_text']

    # Call the store_feedback function to add feedback
    store_feedback(topic_id, feedback_text)

    return jsonify({"message": "Feedback added successfully"})