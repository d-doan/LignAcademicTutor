# LIGN 101 Academic Tutor
This application serves as an Academic tool for LIGN 101 - Introduction to the Study of Language. The app serves as an dynamic, interactive multiple-choice question bank powered by OpenAi's GPT API for students to use in review and practice.

A key feature of this application is its "Instructor Mode," which allows course staff to oversee and refine the question generation process. Instructors can review questions flagged by students for accuracy and, if necessary, input custom prompts and feedback for specific subtopics. This ensures that the content remains accurate and tailored to the course curriculum. Furthermore, the application maintains a log of all prompts and modifications made by instructors, providing them with the flexibility to edit or delete entries as needed.

# Setup

## Cloning the project
1. To get the project itself you will want to open the command line in the particular directory you want the project to be in and run the command below. This will download the project and move you to the main directory of the project

    ```bash
    git clone https://github.com/d-doan/LignAcademicTutor.git
    cd LignAcademicTutor
    ```

## Setting up .env
To setup the .env file which contains the open ai api key, you want to create a .env file in your main directory and populate the file with the line below (replacing with your api key)

```OPEN_AI_API_KEY=[YOUR API KEY]```


## Setting up the Backend

To run the backend of this project locally, you need python and pip installed.

1. Create a virtual environment (Optional but Recommended)

    ```bash
    python -m venv venv

    # Unix:
    source venv/bin/activate

    # Command Prompt:
    venv\Scripts\activate

    # PowerShell (may need to run as admin):
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    .\venv\Scripts\Activate.ps1
    ```

2. Install Flask and Dependencies

    ```bash
    pip install -r requirements.txt
    ```

3. Set Flask Environment Variables

    ```bash
    # Unix:
    export FLASK_APP=run.py

    # Command Prompt:
    set FLASK_APP=run.py

    # PowerShell:
    $env:FLASK_APP = "run.py"
    ```

4. Run the Flask App

    ```bash
    flask run
    ```

5. The App wshould now be running at http://localhost:5000/. Navigate to this url to access the backend of the app.

## Setting up the Frontend

To run the frontend of this project, you'll need Node.js and npm (Node Package Manager) installed on your machine. If you haven't already installed them, you can download and install them from the official website: [Node.js](https://nodejs.org/).

Follow these steps to set up and run the frontend:

1. Navigate to the client directory

   ```bash
   cd client
    ```
2. Install required Node.js packages
    ```bash
    npm install
    ```
3. Start the development server at http://localhost:3000. Note: full functionality requires that the Flask backend is already running on another terminal.
    ```bash
    npm start
    ```

## Setting Up an Admin User
To create an admin user who can generate instructor sign-up codes run the following command but replace \<username> \<password> with your desired credentials

```bash
python -m flask create-admin <username> <password>
```
