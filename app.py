from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/test')
def test_route():
    return jsonify(message="Flask is connected!")

if __name__ == '__main__':
    app.run(debug=True)
