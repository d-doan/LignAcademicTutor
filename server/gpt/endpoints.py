import json
from flask import current_app, jsonify, request
from openai import OpenAI

from . import gpt_blueprint
from .services import store_feedback, retrieve_feedback

@gpt_blueprint.route('/phonetics/transcription', methods=['GET'])
def generate_phonetics_transcription():
    client = OpenAI(api_key=current_app.config["OPENAI_API_KEY"])

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type":"json_object"},
        messages=[
            {"role": "system", "content": "You are a model that specializes in generating multiple choice questions (typically a,b,c,d unless specified) and providing feedback to students for LIGN 101, Introduction to the Study of Language."},
            {"role": "system", "content": "Generate in JSON format of id: 1, question: What is the primary function of..., choices: [A. Option One, B. Option Two, C. Option Three, D. Option Four], correctAnswer: B. Option Two, explanation: Option B is correct because..."},
            {"role": "user", "content": "This question will focus on Phonetic transcripions from typical American English. Can you generate 5 questions that provide an English word and 4 possible transcriptions for each of them. YOU MUST USE STANDARD AMERICAN ENGLISH IPA FOR THIS."},
        ]
    )
    response_content = json.loads(response.choices[0].message.content)
    return jsonify(response_content)


@gpt_blueprint.route('/phonology/phonrules', methods=['GET'])
def generate_phonology_rules():
    client = OpenAI(api_key=current_app.config["OPENAI_API_KEY"])

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type":"json_object"},
        messages=[
            {"role": "system", "content": "You are a model that specializes in generating multiple choice questions (typically a,b,c,d unless specified) and providing feedback to students for LIGN 101, Introduction to the Study of Language."},
            {"role": "system", "content": "Generate in JSON format of id: 1, question: What is the primary function of..., choices: [A. Option One, B. Option Two, C. Option Three, D. Option Four], correctAnswer: B. Option Two, explanation: Option B is correct because..."},
            {"role": "user", "content": "This question will focus on Phonemic rules. Can you generate an English description of a phonological rule and have the student identify the formal phonological rule as answer choices. Do not assume the student knows a particular American English Phonological rule but instead describe it such as Vowels become lengthened at the end of a word which the answer is /V/ -> [V:] / _# Adhere to IPA when doing this task. Can you generate 5 questions that provide an English word and 4 possible transcriptions for each of them. YOU MUST USE STANDARD AMERICAN ENGLISH IPA FOR THIS."},
        ]
    )

    response_content = json.loads(response.choices[0].message.content)
    return jsonify(response_content)


@gpt_blueprint.route('/syntax/trees', methods=['GET'])
def generate_syntax_trees():
    client = OpenAI(api_key=current_app.config["OPENAI_API_KEY"])

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type":"json_object"},
        messages=[
            {"role": "system", "content": "You are a model that specializes in generating multiple choice questions (typically a,b,c,d unless specified) and providing feedback to students for LIGN 101, Introduction to the Study of Language."},
            {"role": "system", "content": "Generate in JSON format of id: 1, question: What is the primary function of..., choices: [A. Option One, B. Option Two, C. Option Three, D. Option Four], correctAnswer: B. Option Two, explanation: Option B is correct because..."},
            {"role": "user", "content": "This question focuses on a student being able to identify specific parts of speech when given a sentence in the context of Syntax. An example is as follows - Identify the complete VP in the following sentence: They drank the dilapidated and chunky coffee. The answer would be drank the dilapidated and chunky coffee Generate 5 new questions that follow this example."},
        ]
    )

    response_content = json.loads(response.choices[0].message.content)
    return jsonify(response_content)


@gpt_blueprint.route('/semantics/entailment', methods=['GET'])
def generate_semantics_entailment():
    client = OpenAI(api_key=current_app.config["OPENAI_API_KEY"])

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type":"json_object"},
        messages=[
            {"role": "system", "content": "You are a model that specializes in generating multiple choice questions (typically a,b,c,d unless specified) and providing feedback to students for LIGN 101, Introduction to the Study of Language."},
            {"role": "system", "content": "Generate in JSON format of id: 1, question: What is the primary function of..., choices: [A. Option One, B. Option Two, C. Option Three, D. Option Four], correctAnswer: B. Option Two, explanation: Option B is correct because..."},
            {"role": "user", "content": "This question focuses on a student being able to identify whether a sentence pair (X,Y) results in X entailing Y or X implying Y. An example is as follows - X: Nikola has small hands. Y: Nikola has hands which results in entailment. However if X: Nikola has hands Y: Nikola has small hands then this is not entailed. Generate 5 new questions that follow this example."},
        ]
    )

    response_content = json.loads(response.choices[0].message.content)
    return jsonify(response_content)


@gpt_blueprint.route('/pragmatics/maxims', methods=['GET'])
def generate_pragmatics_maxims():

    client = OpenAI(api_key=current_app.config["OPENAI_API_KEY"])

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type":"json_object"},
        messages=[
            {"role": "system", "content": "You are a model that specializes in generating multiple choice questions (typically a,b,c,d unless specified) and providing feedback to students for LIGN 101, Introduction to the Study of Language."},
            {"role": "system", "content": "Generate in JSON format of id: 1, question: What is the primary function of..., choices: [A. Option One, B. Option Two, C. Option Three, D. Option Four], correctAnswer: B. Option Two, explanation: Option B is correct because..."},
            {"role": "user", "content": "This question focuses on a student being able to identify whether a given sentence results in the speaker opting out or violating a Gricean Maxim in the context of Pragmatics. You should generate a phrase and then have the answer choices as different Gricean maximums. As an example - I'm not at liberty to say any more than that is an example of the maxim of Quantity. Generate 5 new questions that follow this example."},
        ]
    )

    response_content = json.loads(response.choices[0].message.content)
    return jsonify(response_content)


@gpt_blueprint.route('/submit_feedback', methods=['POST'])
def submit_feedback():
    # Extract feedback from request and store it
    topic_id = request.json.get('topic_id')
    text = request.json.get('text')
    store_feedback(topic_id, text)
    return jsonify(success=True)
