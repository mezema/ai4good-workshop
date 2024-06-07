from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'model.joblib')

print("Current Working Directory:", os.getcwd())
print("Model Path:", model_path)

model = joblib.load(model_path)

class_names = np.array(['setosa', 'versicolor', 'virginica'])

app = Flask(__name__)

@app.route('/api/home')
def read_root():
    return "<p>Hello from the AI4Good Demo API</p>"

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predicts the class of a given set of features.

    Args:
        data (dict): A dictionary containing the features to predict.
        e.g. {"features": [1, 2, 3, 4]}

    Returns:
        dict: A dictionary containing the predicted class.
    """
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)
    class_name = class_names[prediction][0]
    return jsonify({'predicted_class': class_name})

if __name__ == '__main__':
    app.run(debug=True)