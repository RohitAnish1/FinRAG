import joblib
import pandas as pd
import numpy as np
import os
import xgboost as xgb

# Define the model version to use. This should match the version saved by train.py
MODEL_VERSION = 'v4'
MODEL_FILENAME = f'xgb_stock_predictor_v5.joblib'
FEATURES_FILENAME = f'xgb_stock_predictor_v5_features.joblib'

def get_latest_model_and_features():
    """
    Loads the specified model and its corresponding feature list from the saved_models directory.
    """
    model = None
    features = None
    try:
        # Construct robust paths to the model and feature files
        SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
        BACKEND_ROOT = os.path.dirname(SCRIPT_DIR)
        model_path = os.path.join(BACKEND_ROOT, "models", "saved_models", MODEL_FILENAME)
        features_path = os.path.join(BACKEND_ROOT, "models", "saved_models", FEATURES_FILENAME)
        
        print(f"Loading model from {model_path}...")
        model = joblib.load(model_path)
        print("Model loaded successfully.")
        
        print(f"Loading feature list from {features_path}...")
        features = joblib.load(features_path)
        print("Feature list loaded successfully.")

    except FileNotFoundError as e:
        print(f"Error: A required file was not found. Please ensure the model is trained first by running train.py.")
        print(f"Missing file: {e.filename}")
    except Exception as e:
        print(f"An unexpected error occurred while loading files: {e}")
        
    return model, features

def make_prediction(model, feature_data, feature_list):
    """
    Makes a prediction on a single data point (provided as a dictionary).
    
    Args:
        model: The trained XGBoost model object.
        feature_data (dict): A dictionary where keys are feature names and values are the feature values.
        feature_list (list): The ordered list of feature names the model was trained on.

    Returns:
        A dictionary containing the prediction ('Up' or 'Down') and confidence percentage.
    """
    if model is None or feature_list is None:
        return {"error": "Model or feature list is not loaded."}
    try:
        # Create a DataFrame from the input dictionary, ensuring it uses the exact feature order from training
        df = pd.DataFrame([feature_data])
        df = df.reindex(columns=feature_list, fill_value=0)
        dmatrix = xgb.DMatrix(df)
        prediction_proba = model.predict(dmatrix)
        if not isinstance(prediction_proba, (list, np.ndarray)) or len(prediction_proba) == 0:
            return {"error": "Model did not return a valid prediction."}
        confidence_up = float(prediction_proba[0])
        if confidence_up > 0.5:
            prediction = 'Up'
            confidence_pct = confidence_up * 100
        else:
            prediction = 'Down'
            confidence_pct = (1 - confidence_up) * 100
        return {'prediction': prediction, 'confidence_pct': round(confidence_pct, 2)}
    except Exception as e:
        return {"error": f"An error occurred during prediction: {e}"}

if __name__ == '__main__':
    print("--- Running example prediction ---")
    
    # Load the model and the feature list
    predictor_model, model_features = get_latest_model_and_features()
    
    # Only proceed if both the model and feature list were loaded successfully
    if predictor_model and model_features:
        # Create a dummy feature vector with the correct column names for testing
        # In a real application, you would generate these features from live market/news data
        dummy_features = {feature: np.random.rand() for feature in model_features}

        # Make a prediction using the loaded model and the dummy data
        result = make_prediction(predictor_model, dummy_features, model_features)
        
        print("\nExample Prediction Result:")
        print(result)