from flask import Flask, request, jsonify
import pandas as pd
import pickle

app = Flask(__name__)

model = pickle.load(open("car_price_model_final.pkl", "rb"))


@app.post('/predict')
def predict():
    try:
        data = request.get_json()

        if isinstance(data["year"], int):
            return jsonify({"error": "Year must be a string"}), 400
        
        if not isinstance(data["km_driven"], int):
            return jsonify({"error": "km_driven must be an integer"}), 400

        # print(model.feature_names_in_)  # order of features ['year' 'km_driven' 'fuel' 'company']
        df = pd.DataFrame([{
            "year": data["year"],
            "km_driven": data["km_driven"],
            "fuel": data["fuel"],
            "company": data["company"]
        }])

        # Predict
        prediction = model.predict(df)

        ans = jsonify({"prediction": str(prediction)})

        return ans
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/')
def home():
    return "Hello, Flask!"



if __name__ == "__main__":
    app.run(debug=True)
