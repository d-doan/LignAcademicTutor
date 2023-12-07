import json
from flask import current_app, jsonify, request
from openai import OpenAI
from server.gpt.assistant_wrapper import AssistantWrapper

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

    # print(response.choices[0].message.content)
    response_content = json.loads(response.choices[0].message.content)
    return jsonify(response_content)


@gpt_blueprint.route('/phonology/phonrules', methods=['GET'])
def generate_phonology_rules():
    topic = 'phonrules'
    instruction="""You already have access to the files below. Given question 3 and 4 of phonology_hw.pdf as example questions, can you generate 5 NEW questions that DO NOT USE ANY EXAMPLES FROM THE FILES PROVIDED. These questions should generate an English description of a phonological rule and have the student identify the formal phonological rule as answer choices. Adhere to IPA when doing this task. Refer to the section titled Phonological Rule Formatting in phonreference.pdf when generating the phonological rules.
Example Response Format, include curly braces for json formatting:
{"question": "What is the primary function of...", "choices": ["A. Option One", "B. Option Two", "C. Option Three", "D. Option Four"], "correctAnswer": "B", "explanation": "Option B is correct because..."}"""

    response = AssistantWrapper.make_call(topic,instruction)

    print(response.data[0].content[0].text.value)

    return jsonify(response.data[0].content[0].text.value)


@gpt_blueprint.route('/syntax/trees', methods=['GET'])
def generate_syntax_trees():
    topic = 'trees'
    instruction="""You already have access to the files below. Given question 5 of syntax_hw.pdf, question 5 of review_hw.pdf, and question 1 on syntax_hw2.pdf as example questions, can you generate 5 NEW questions that DO NOT USE ANY EXAMPLES FROM THE FILES PROVIDED. These questions should include a structurally ambiguous sentence and generate multiple syntax trees that correctly describe the sentence, specifically you SHOULD be generating syntax trees by visually generate them in markdown so that the student can easily read them. To do so, you need phase structure rules that you can find in syntax_phase_structure_rules.pdf, when creating trees ONLY use these rules and nothing else. Make sure to follow the json format mentioned in the assistant's instructions and generate nothing else.
Example Response Format, include curly braces for json formatting:
{"question": "What is the primary function of...", "choices": ["A. Option One", "B. Option Two", "C. Option Three", "D. Option Four"], "correctAnswer": "B", "explanation": "Option B is correct because..."}"""

    response = AssistantWrapper.make_call(topic,instruction)

    print(response.data[0].content[0].text.value)

    return jsonify(response.data[0].content[0].text.value)


@gpt_blueprint.route('/semantics/entailment', methods=['GET'])
def generate_semantics_entailment():
    topic = 'entailment'
    instruction = """You already have access to the files below. Given question 2 of semantics_hw.pdf, and question 1 of semantics_hw2.pdf as example questions, can you generate 5 NEW questions that DO NOT USE ANY EXAMPLES FROM THE FILES PROVIDED that test a student's understanding of identifying whether a sentence pair (X,Y) results in X entailing Y or X implying Y in the context of Semantics and Pragmatics. Only generate in the format below
Example Response Format, include curly braces for json formatting:
{"question": "What is the primary function of...", "choices": ["A. Option One", "B. Option Two", "C. Option Three", "D. Option Four"], "correctAnswer": "B", "explanation": "Option B is correct because..."}"""

    response = AssistantWrapper.make_call(topic,instruction)

    print(response.data[0].content[0].text.value)

    return jsonify(response.data[0].content[0].text.value)


@gpt_blueprint.route('/pragmatics/maxims', methods=['GET'])
def generate_pragmatics_maxims():
    topic = 'maxims'
    instruction ="""You do not need to use any upload files. Generate 5 new questions that test a student's understanding of Gricean Maxims and in particular how a given phrase can "opt out" of a specific manner or how a given phrase violates a particular maxim. This phrase should be in response in a conversation so generate what speaker 1 said and what speaker 2 said to opt out or violate a maxim. This should focus on the student being able to identify which maxim got violated from the provided phrase. Only generate in the format below
Example Response Format, include curly braces for json formatting:
{"question": "What is the primary function of...", "choices": ["A. Option One", "B. Option Two", "C. Option Three", "D. Option Four"], "correctAnswer": "B", "explanation": "Option B is correct because..."}"""

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