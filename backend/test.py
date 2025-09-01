import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

prompt = "What is the market sentiment around Reliance Industries?"
model = genai.GenerativeModel('gemini-1.5-flash-latest')
response = model.generate_content(prompt)
print(response.text)