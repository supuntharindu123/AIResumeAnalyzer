# AI Service (Python Flask)

This Flask application serves as the AI backend for resume analysis and job description matching.

## Setup

1.  Navigate into the `ai-service` directory:
    ```bash
    cd ai-service
    ```
2.  Create a virtual environment (recommended):
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    - On Windows: `.\venv\Scripts\activate`
    - On macOS/Linux: `source venv/bin/activate`
4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  Download the necessary spaCy model and Sentence-BERT model (they will download automatically on first run, but you can pre-download spaCy):
    ```bash
    python -m spacy download en_core_web_sm
    # Sentence-BERT model 'all-MiniLM-L6-v2' downloads on first use if not present.
    ```
6.  Create a `.flaskenv` file from `.flaskenv.example`:
    ```bash
    cp .flaskenv.example .flaskenv
    ```
7.  Run the Flask application:
    ```bash
    flask run --port 5001
    ```

## API Endpoints

- `POST /analyze-resume-jd`: Accepts a `multipart/form-data` request with:
  - `resume` (file: PDF or DOCX)
  - `jobDescription` (string)
    Returns a JSON object with `match_score`, `matched_details`, `resume_keywords_extracted`, `jd_keywords_extracted`, and a `message`.
- `GET /`: Health check. Returns `{"status": "AI Service Running!"}`.
