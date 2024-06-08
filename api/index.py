from flask import Flask

app = Flask(__name__)

@app.route('/api/home')
def read_root():
    return "<p>Hello from the AI4Good Demo API</p>"

if __name__ == '__main__':
    app.run(debug=True)