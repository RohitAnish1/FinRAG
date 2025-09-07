# FinRAG

**FinRAG** is an advanced AI-powered financial planner and dashboard. It analyzes current stock trends, ingests news feeds and real-time stock data, and provides actionable investment analysis and recommendations. The platform leverages Google Gemini’s latest AI models, including retrieval-augmented generation (RAG) with a vector database, to deliver context-rich, personalized financial insights via an interactive chat interface and dashboard.

---

## Features

- **AI-driven financial analysis and planning**
- **Real-time stock data and news feed integration**
- **Automated investment recommendations**
- **Gemini-powered retrieval from vector database for context-aware answers**
- **Interactive chat interface for personalized advice**
- **Comprehensive financial dashboard for tracking and visualization**
- **FastAPI backend and React frontend**

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js & npm
- Google Cloud service account with Vertex AI User role
- Gemini Generative Language API enabled in your Google Cloud project

### Backend Setup

1. Clone the repository.
2. Create and activate a Python virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Add your Google Cloud service account JSON file to the `backend` directory.
5. Set environment variables:
   ```sh
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account.json"
   ```
6. Start the backend server:
   ```sh
   uvicorn backend.app:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend development server:
   ```sh
   npm run dev
   ```
4. Access the app at [http://localhost:8080](http://localhost:8080).

---

## Usage

- Interact with the AI chatbot to get financial advice, stock analysis, and portfolio recommendations.
- View your financial dashboard for real-time insights and visualizations.
- The backend uses Gemini models to retrieve relevant information from the vector database and generate context-rich answers.

---

## Contributing

We welcome collaborators!  
If you’re interested in AI, finance, or full-stack development, feel free to open issues or submit pull requests.

---

## License

MIT

---

## Contact

For questions or collaboration, please open an issue or contact the
