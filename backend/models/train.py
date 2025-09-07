import pandas as pd
import xgboost as xgb
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import numpy as np

# This function remains the same
def create_lagged_features(df, lags=[1, 2, 3, 5]):
    df_new = df.copy()
    df_new = df_new.sort_values(by=['Ticker', 'Date'])
    df_new['Return'] = df_new.groupby('Ticker')['Close'].pct_change()
    for lag in lags:
        df_new[f'Return_lag_{lag}'] = df_new.groupby('Ticker')['Return'].shift(lag)
        df_new[f'SMA_20_lag_{lag}'] = df_new.groupby('Ticker')['SMA_20'].shift(lag)
        df_new[f'RSI_14_lag_{lag}'] = df_new.groupby('Ticker')['RSI_14'].shift(lag)
    df_new = df_new.dropna(subset=[col for col in df_new.columns if '_lag_' in col])
    return df_new

def train_model():
    # --- 1. Configuration and Data Loading ---
    SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
    BACKEND_ROOT = os.path.dirname(SCRIPT_DIR)
    DATA_FILE = os.path.join(BACKEND_ROOT, "data", "combined_ml_dataset.csv")
    MODEL_OUTPUT_DIR = os.path.join(BACKEND_ROOT, "models", "saved_models")
    os.makedirs(MODEL_OUTPUT_DIR, exist_ok=True)

    print(f"Loading data from {DATA_FILE}...")
    df = pd.read_csv(DATA_FILE)
    print("Data loaded successfully.")

    # --- 2. Feature Engineering ---
    print("\nCreating lagged features...")
    df = create_lagged_features(df)
    print("Lagged features created.")
    
    # --- 3. Feature and Target Selection ---
    target = 'Target'
    features_to_exclude = [target, 'Date', 'Ticker', 'Open', 'High', 'Low', 'Close', 'Volume', 'Return']
    features = [col for col in df.columns if col not in features_to_exclude]
    
    X = df[features]
    y = df[target]

    # --- 4. Time-Series Train-Test Split ---
    split_date = '2024-01-01'
    train_indices = df['Date'] < split_date
    test_indices = df['Date'] >= split_date

    X_train, X_test = X[train_indices], X[test_indices]
    y_train, y_test = y[train_indices], y[test_indices]

    print(f"\nTraining data shape: {X_train.shape}")
    print(f"Testing data shape: {X_test.shape}")
    
    dtrain = xgb.DMatrix(X_train, label=y_train)
    dtest = xgb.DMatrix(X_test, label=y_test)

    # --- 5. Model Training ---
    print("\nTraining XGBoost model...")
    scale_pos_weight = np.sum(y_train == 0) / np.sum(y_train == 1)
    print(f"Calculated scale_pos_weight: {scale_pos_weight:.2f}")

    params = {
        'objective': 'binary:logistic', 'eval_metric': 'logloss', 'device': 'cuda',
        'learning_rate': 0.05, 'max_depth': 5, 'subsample': 0.8,
        'colsample_bytree': 0.8, 'random_state': 42, 'scale_pos_weight': scale_pos_weight
    }

    model = xgb.train(
        params, dtrain, num_boost_round=1000,
        evals=[(dtest, 'validation')], early_stopping_rounds=50, verbose_eval=False
    )
    print("Model training complete.")

    # --- 6. Evaluation ---
    print("\nEvaluating model performance...")
    preds_proba = model.predict(dtest)
    y_pred = (preds_proba > 0.5).astype(int)
    
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy on Test Set: {accuracy * 100:.2f}%")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Down (0)', 'Up (1)']))

    # --- 7. Save the Model AND the Feature List ---
    model_path = os.path.join(MODEL_OUTPUT_DIR, 'xgb_stock_predictor_v5.joblib')
    features_path = os.path.join(MODEL_OUTPUT_DIR, 'xgb_stock_predictor_v5_features.joblib')
    
    joblib.dump(model, model_path)
    joblib.dump(features, features_path) # <-- NEW: Save the list of feature names

    print(f"\n✅ Model v4 saved successfully to {model_path}")
    print(f"✅ Feature list for v4 saved successfully to {features_path}")

if __name__ == '__main__':
    train_model()

