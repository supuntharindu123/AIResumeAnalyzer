An intelligent AI-powered platform that analyzes resumes against job descriptions, providing detailed insights, match scores, and optimization suggestions to help job seekers improve their chances of landing interviews.

🚀 Features
🔍 AI-Powered Analysis
Smart Resume-Job Matching with semantic analysis using Sentence-BERT
Intelligent Keyword Extraction using spaCy NLP models
Cosine Similarity Scoring for accurate compatibility measurement
Multi-format Support (PDF, DOCX)
📊 Comprehensive Insights
Match Score Visualization with color-coded ratings
Missing Keywords Detection with actionable suggestions
Format & Quality Analysis with optimization tips
Detailed Reporting with breakdown analysis
👤 User Experience
Secure Authentication with JWT tokens
Interactive Dashboard with analysis history
Drag & Drop File Upload with preview functionality
Responsive Design for all devices

🛠️ Technical Architecture
Microservices Architecture with separate AI service
RESTful APIs for seamless communication
Real-time Processing with progress indicators
Secure File Management with proper validation


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
# React Frontend

This is the user interface for the Resume Analyzer application, now with job description matching capabilities.

## Setup

1.  Navigate into the `client` directory:
    ```bash
    cd client
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
3.  Start the React development server:
    ```bash
    npm run dev
    ```
    This will open the app in your browser at `http://localhost:3000`.

## Features

* Upload PDF or DOCX resume files.
* Input a job description for matching.
* Display a **match score** (percentage) between the resume and job description.
* Show **extracted keywords** from both the resume and job description.
* Provide **matching details**, indicating which resume keywords semantically matched job description keywords and their similarity scores.
* View a list of past analyses fetched from the Node.js backend, including their match scores.

# Node.js Express Backend

This is the main backend for the Resume Analyzer MERN application. It handles API requests from the frontend, communicates with the Python AI service, and stores analysis results in MongoDB.

## Setup

1.  Navigate into the `server` directory:
    ```bash
    cd server
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file from `.env.example`:
    ```bash
    cp .env.example .env
    ```
4.  Update the `.env` file with your MongoDB URI and the Python AI service URL if it's not on default.
    ```
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/resumeAnalyzerDB
    PYTHON_AI_SERVICE_URL=http://localhost:5001
    ```
5.  Run the Express server:
    ```bash
    
    # or
    npm nodemon index.js
    ```

## API Endpoints

GET  /api/resume/view/:filename    # View resume file
GET  /api/resume/download/:filename # Download resume
POST /api/upload                   # Upload file
POST /api/resume/analyze   # Analyze resume
GET  /api/resume/:id       # Get analysis by ID
GET  /api/resume/user/:id  # Get user's analyses
DELETE /api/resume/:id     # Delete analysis
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update profile
