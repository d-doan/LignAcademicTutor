import json
from flask import current_app, jsonify, request
from openai import OpenAI

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


@gpt_blueprint.route('/feedback/submit', methods=['POST'])
def submit_feedback():
    data = request.json
    topic_id = data['topic_id']
    feedback_text = data['feedback_text']
    store_feedback(topic_id, feedback_text)
    return jsonify({"message": "Feedback submitted successfully"})

@gpt_blueprint.route('/feedback/<topic_id>', methods=['GET'])
def get_feedback(topic_id):
    feedback = retrieve_feedback(topic_id)
    return jsonify(feedback)

@gpt_blueprint.route('/feedback/edit/<feedback_id>', methods=['PUT'])
def edit_feedback(feedback_id):
    new_feedback_text = request.json['feedback_text']
    update_feedback(feedback_id, new_feedback_text)
    return jsonify({"message": "Feedback updated successfully"})

@gpt_blueprint.route('/feedback/delete/<feedback_id>', methods=['DELETE'])
def delete_feedback(feedback_id):
    remove_feedback(feedback_id)
    return jsonify({"message": "Feedback deleted successfully"})
