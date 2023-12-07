
# TODO NEEDS COMPLETE OVERHAUL
def format_response(openai_response):
    # This is a simplified example.
    # You need to parse the openai_response correctly depending on the actual format of the response.
    # Assuming the API returns a list of questions in its 'choices' field.
    questions = openai_response.get('choices', [])

    # This will be your final formatted questions list
    formatted_questions = []

    for question in questions:
        # Split the text into lines and extract the question and choices
        lines = question['text'].strip().split('\n')
        question_text = lines[0]  # The first line would be the question
        choices = lines[1:]  # The subsequent lines would be the choices

        # Assuming the first choice after the question is the correct one
        correct_answer = 'A'  # or however you determine the correct answer

        # Construct the formatted question dictionary
        formatted_question = {
            "question": question_text,
            "choices": choices,
            "correctAnswer": correct_answer,
            # Add a placeholder explanation or generate it as needed
            "explanation": "This is the correct answer because..."
        }
        formatted_questions.append(formatted_question)

    return formatted_questions
