from server.app import create_app
from flask_cors import CORS

app = create_app()

# CORS Configuration since Flask server and React app run on different domains/ports
CORS(app, supports_credentials=True)

if __name__ == '__main__':
    app.run(debug=True)
