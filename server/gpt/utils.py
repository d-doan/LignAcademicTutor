import re
import json

def parseGPTQuestions(gpt_text):
    # Regex pattern to find the JSON-like part in the GPT-3 output
    pattern = re.compile(r'{\s*"question":\s*".+?",\s*"choices":\s*\[.+?\],\s*"correctAnswer":\s*".+?",\s*"explanation":\s*".+?"\s*}')

    # Find all matches in the GPT-3 output
    matches = pattern.findall(gpt_text)

    # Parse the JSON-like parts into actual JSON and then into the desired Question format
    questions = []
    for match in matches:
        # Convert string to JSON
        question_data = json.loads(match)
        
        # Transform into Question format
        question = {
            "id": len(questions) + 1,  # Assign a new ID based on the current count
            "questionText": question_data["question"],
            "options": question_data["choices"],
            "correctAnswer": question_data["correctAnswer"]
        }
        questions.append(question)

    # Display the formatted questions
    formatted_questions_json = json.dumps(questions, indent=2)
    return formatted_questions_json