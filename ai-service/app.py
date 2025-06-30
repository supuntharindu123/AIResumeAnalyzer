import os
import io
import re
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from pdfminer.high_level import extract_text as extract_text_from_pdf
from docx import Document
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Set up basic logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm") # Use a small model for general NLP tasks
    logging.info("spaCy model 'en_core_web_sm' loaded successfully.")
except Exception as e:
    logging.error(f"Error loading spaCy model: {e}. Please ensure it's downloaded (python -m spacy download en_core_web_sm).")
    nlp = None

# Load Sentence-BERT model for semantic similarity
try:
    # 'all-MiniLM-L6-v2' is a good balance of size and performance
    sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
    logging.info("Sentence-BERT model 'all-MiniLM-L6-v2' loaded successfully.")
except Exception as e:
    logging.error(f"Error loading Sentence-BERT model: {e}. Please ensure you have internet access for first run.")
    sentence_model = None

# --- Helper Functions for Text Extraction ---
def extract_text_from_doc(file_stream, file_extension):
    """Extracts text from PDF or DOCX file streams."""
    if file_extension == '.pdf':
        try:
            return extract_text_from_pdf(file_stream)
        except Exception as e:
            logging.error(f"PDF text extraction error: {e}")
            return None
    elif file_extension == '.docx':
        try:
            document = Document(file_stream)
            return "\n".join([paragraph.text for paragraph in document.paragraphs])
        except Exception as e:
            logging.error(f"DOCX text extraction error: {e}")
            return None
    else:
        return None

# --- Advanced Skill/Keyword Extraction (Improved) ---
def extract_keywords_from_text(text, nlp_model):
    """
    Extracts potential keywords/skills from text using spaCy and simple heuristics.
    For production, consider a predefined skill dictionary or a custom NER model.
    """
    if not nlp_model or not text:
        return []

    doc = nlp_model(text.lower())
    keywords = set()

    # Rule-based extraction (can be expanded significantly)
    # Nouns, Proper Nouns, and compound nouns (e.g., 'machine learning')
    for chunk in doc.noun_chunks:
        keywords.add(chunk.text)
    
    # Consider specific POS tags
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"] and len(token.text) > 2 and not token.is_stop and token.is_alpha:
            keywords.add(token.text)
        # Add common programming languages/tools that might not be simple nouns
        if token.text in ["python","django", "java", "javascript", "react", "node", "sql", "aws", "azure", "gcp", "docker", "kubernetes", "git", "linux","react.js", "agile", "scrum", "devops","back-end","front-end","vue","PostgreSQL","mysql","mongodb"]:
             keywords.add(token.text)

    # Clean and filter common non-skill words (expand this list!)
    common_words_to_exclude = {
        "experience", "management", "project", "system", "data", "developer", "engineer","team members","enviroments","tests","test","service"
        "lead", "team", "master", "university", "college","features","exam","examination", "certification", "certifications",
        "solution", "role", "work", "responsibilities", "skills","new features","basic understanding","stand","knowledgeable", "expertise", "familiarity",
        "ability", "strong", "proven", "excellent", "knowledge", "understanding", "experience with","institute","end","unit",
    }
    filtered_keywords = [
        kw for kw in sorted(list(keywords))
        if kw not in common_words_to_exclude and len(kw) > 1 and not re.search(r'\d', kw) # exclude numbers
    ]
    return list(set(filtered_keywords)) # Return as list of unique keywords

# --- Semantic Similarity Matching ---
def calculate_semantic_similarity(texts1, texts2, model):
    """
    Calculates cosine similarity between two lists of texts using Sentence-BERT.
    Returns a similarity matrix.
    """
    if not model:
        return np.array([[0.0]]) # Return a default if model not loaded

    embeddings1 = model.encode(texts1, convert_to_tensor=False)
    embeddings2 = model.encode(texts2, convert_to_tensor=False)

    # Handle cases where one list might be empty
    if len(embeddings1) == 0 or len(embeddings2) == 0:
        return np.array([[0.0]])

    return cosine_similarity(embeddings1, embeddings2)

# --- Main Analysis Function ---
def perform_job_matching(resume_text, job_description_text):
    if not nlp or not sentence_model:
        return {
            "matchScore": 0.0,
            "matched_details": [],
            "message": "AI models not loaded. Cannot perform full analysis."
        }

    # 1. Extract keywords/skills from Resume and Job Description
    resume_keywords = extract_keywords_from_text(resume_text, nlp)
    jd_keywords = extract_keywords_from_text(job_description_text, nlp)

    # If no keywords are found, return early
    if not jd_keywords:
        return {
            "match_score": 0.0,
            "matched_details": [],
            "message": "Could not extract keywords from Job Description. Please provide a more detailed JD."
        }
    if not resume_keywords:
        return {
            "match_score": 0.0,
            "matched_details": [],
            "message": "Could not extract keywords from Resume. Please ensure resume is parsable."
        }

    # 2. Semantic Similarity Calculation
    # We'll match each resume keyword against all JD keywords
    similarity_matrix = calculate_semantic_similarity(resume_keywords, jd_keywords, sentence_model)

    # 3. Aggregate Matching Details and Score
    matched_details = []
    total_score = 0.0
    matched_jd_keywords = set() # To track which JD keywords were matched

    for i, res_kw in enumerate(resume_keywords):
        best_match_score = 0.0
        best_jd_kw = ""
        
        # Find the best matching JD keyword for each resume keyword
        for j, jd_kw in enumerate(jd_keywords):
            score = similarity_matrix[i, j]
            if score > best_match_score:
                best_match_score = score
                best_jd_kw = jd_kw
        
        # Define a similarity threshold for a "match"
        match_threshold = 0.6 # Adjust this based on desired strictness
        if best_match_score >= match_threshold:
            matched_details.append({
                "resume_keyword": res_kw,
                "jd_match": best_jd_kw,
                "similarity_score": round(float(best_match_score), 2)
            })
            total_score += best_match_score # Add to overall score
            matched_jd_keywords.add(best_jd_kw) # Mark JD keyword as matched

    # Calculate final match score
    # A simple approach: sum of best match scores, normalized by number of JD keywords
    # This heavily weights if resume has relevant skills for JD.
    # More advanced: consider presence of all critical JD skills, etc.
    if jd_keywords:
        # Sum of scores for JD keywords that found a match
        # Normalize by the number of JD keywords to get a percentage-like score
        overall_match_score = (sum([d['similarity_score'] for d in matched_details]) / len(jd_keywords)) * 100
    else:
        overall_match_score = 0.0


    return {
        "matchScore": round(min(overall_match_score, 100.0), 2), # Cap at 100%
        "matched_details": matched_details,
        "resume_keywords_extracted": resume_keywords,
        "jd_keywords_extracted": jd_keywords,
        "message": "Semantic matching performed. Adjust 'match_threshold' and scoring logic for fine-tuning."
    }

# --- Resume Format Checking Functions ---
def check_resume_format(resume_text):
    """
    Comprehensive resume format checking function.
    Returns format issues and suggestions for improvement.
    """
    format_issues = []
    format_score = 100  # Start with perfect score, deduct points for issues
    
    # Convert to lowercase for case-insensitive checking
    text_lower = resume_text.lower()
    
    # 1. Contact Information Checks
    contact_issues = check_contact_information(resume_text, text_lower)
    format_issues.extend(contact_issues)
    format_score -= len(contact_issues) * 10
    
    # 2. Section Structure Checks
    section_issues = check_section_structure(text_lower)
    format_issues.extend(section_issues)
    format_score -= len(section_issues) * 15
    
    # 3. Content Quality Checks
    content_issues = check_content_quality(resume_text, text_lower)
    format_issues.extend(content_issues)
    format_score -= len(content_issues) * 8
    
    # 4. Professional Formatting Checks
    formatting_issues = check_professional_formatting(resume_text, text_lower)
    format_issues.extend(formatting_issues)
    format_score -= len(formatting_issues) * 5
    
    # 5. Length and Structure Checks
    length_issues = check_length_and_structure(resume_text)
    format_issues.extend(length_issues)
    format_score -= len(length_issues) * 12
    
    return {
        "format_score": max(0, format_score),
        "format_issues": format_issues,
        "total_issues": len(format_issues)
    }

def check_contact_information(resume_text, text_lower):
    """Check for essential contact information."""
    issues = []
    
    # Email check
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if not re.search(email_pattern, resume_text):
        issues.append("Missing email address")
    
    # Phone number check (various formats)
    phone_patterns = [
         r'\(\+\d{1,3}\)\s\d{2}\s\d{7}',  # International format
        r'\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',  # US format
        r'\+?\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}',  # International
        r'\+\d{1,9}\s\d{9}' 
    ]
    
    phone_found = any(re.search(pattern, resume_text) for pattern in phone_patterns)
    if not phone_found:
        issues.append("Missing or improperly formatted phone number")
    
    # LinkedIn profile check
    linkedin_patterns = [
        r'linkedin\.com/in/[\w-]+',
        r'linkedin\.com/pub/[\w-]+',
        r'www\.linkedin\.com'
    ]
    linkedin_found = any(re.search(pattern, text_lower) for pattern in linkedin_patterns)
    if not linkedin_found:
        issues.append("Consider adding LinkedIn profile")
    
    return issues

def check_section_structure(text_lower):
    """Check for essential resume sections."""
    issues = []
    
    # Essential sections
    essential_sections = {
        'experience': ['experience', 'work experience', 'employment', 'professional experience'],
        'education': ['education', 'academic background', 'qualifications'],
        'skills': ['skills', 'technical skills', 'competencies', 'technologies']
    }
    
    for section_name, keywords in essential_sections.items():
        section_found = any(keyword in text_lower for keyword in keywords)
        if not section_found:
            issues.append(f"Missing {section_name.title()} section")
    
    # Check for objective/summary
    summary_keywords = ['summary', 'objective', 'profile', 'about']
    summary_found = any(keyword in text_lower for keyword in summary_keywords)
    if not summary_found:
        issues.append("Consider adding a professional summary or objective")
    
    return issues

def check_content_quality(resume_text, text_lower):
    """Check content quality and completeness."""
    issues = []
    
    # Check for dates in experience
    date_patterns = [
        r'\b(19|20)\d{2}\b',  # Years
        r'\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(19|20)\d{2}\b',  # Month Year
        r'\b\d{1,2}/\d{4}\b'  # MM/YYYY
    ]
    
    date_found = any(re.search(pattern, text_lower) for pattern in date_patterns)
    if not date_found:
        issues.append("Missing employment dates - add start and end dates for positions")
    
    # Check for action verbs (indicating accomplishments)
    action_verbs = [
        'achieved', 'developed', 'implemented', 'managed', 'created', 'improved',
        'increased', 'reduced', 'led', 'coordinated', 'designed', 'built',
        'established', 'streamlined', 'optimized', 'delivered'
    ]
    
    action_verb_count = sum(1 for verb in action_verbs if verb in text_lower)
    if action_verb_count < 3:
        issues.append("Use more action verbs to describe accomplishments")
    
    # Check for quantifiable achievements
    # number_patterns = [
    #     r'\d+%',  # Percentages
    #     r'\$\d+',  # Dollar amounts
    #     r'\d+\s*(million|thousand|k\b)',  # Large numbers
    #     r'\d+\s*(years?|months?)'  # Time periods
    # ]
    
    # quantifiable_found = any(re.search(pattern, text_lower) for pattern in number_patterns)
    # if not quantifiable_found:
    #     issues.append("Add quantifiable achievements (percentages, dollar amounts, time saved)")
    
    return issues

def check_professional_formatting(resume_text, text_lower):
    """Check professional formatting standards."""
    issues = []
    
    # Check for excessive use of "I"
    i_count = len(re.findall(r'\bi\b', text_lower))
    total_sentences = len(re.findall(r'[.!?]+', resume_text))
    
    if total_sentences > 0 and i_count / total_sentences > 0.1:
        issues.append("Avoid first-person pronouns (I, me, my) - use active voice instead")
    
    # Check for appropriate capitalization
    lines = resume_text.split('\n')
    uncapitalized_lines = 0
    
    for line in lines:
        line = line.strip()
        if line and len(line) > 3 and line[0].islower():
            uncapitalized_lines += 1
    
    if uncapitalized_lines > len(lines) * 0.2:  # More than 20% of lines
        issues.append("Inconsistent capitalization - ensure proper sentence case")
    
    # Check for excessive punctuation
    excessive_punct = re.findall(r'[!]{2,}|[?]{2,}|[.]{3,}', resume_text)
    if excessive_punct:
        issues.append("Remove excessive punctuation marks")
    
    return issues

def check_length_and_structure(resume_text):
    """Check resume length and overall structure."""
    issues = []
    
    # Word count check
    word_count = len(resume_text.split())
    
    if word_count < 200:
        issues.append("Resume appears too short - add more detail about your experience")
    elif word_count > 1000:
        issues.append("Resume may be too long - consider condensing to 1-2 pages")
    
    # Line length check (for readability)
    lines = resume_text.split('\n')
    long_lines = [line for line in lines if len(line) > 100]
    
    if len(long_lines) > len(lines) * 0.3:
        issues.append("Some lines are too long - break into shorter, readable chunks")
    
    # Check for empty lines (spacing issues)
    empty_lines = sum(1 for line in lines if not line.strip())
    if empty_lines > len(lines) * 0.4:
        issues.append("Too many empty lines - optimize spacing for better readability")
    
    return issues

def generate_format_suggestions(format_issues):
    """Generate specific suggestions based on format issues."""
    suggestions = []
    
    issue_to_suggestion = {
        "Missing email address": "Add a professional email address at the top of your resume",
        "Missing or improperly formatted phone number": "Include a phone number in format: (+94) 784567890",
        "Consider adding LinkedIn profile": "Add your LinkedIn profile URL to increase professional visibility",
        "Missing Experience section": "Add a Work Experience section with your employment history",
        "Missing Education section": "Include an Education section with your academic qualifications",
        "Missing Skills section": "Add a Skills section highlighting your technical and professional abilities",
        "Consider adding a professional summary": "Add a 2-3 line professional summary at the top of your resume",
        "Missing employment dates": "Include start and end dates for all positions (MM/YYYY format)",
        "Use more action verbs": "Start bullet points with strong action verbs (achieved, developed, managed)",
        "Add quantifiable achievements": "Include specific numbers, percentages, and measurable results",
        "Avoid first-person pronouns": "Remove 'I', 'me', 'my' - use action-oriented language instead",
        "Inconsistent capitalization": "Ensure consistent capitalization throughout your resume",
        "Remove excessive punctuation": "Use standard punctuation - avoid multiple exclamation marks",
        "Resume appears too short": "Expand on your experience with more detailed descriptions",
        "Resume may be too long": "Condense content to focus on most relevant and impactful information",
        "Some lines are too long": "Break long paragraphs into shorter, scannable bullet points",
        "Too many empty lines": "Optimize spacing for a clean, professional appearance"
    }
    
    for issue in format_issues:
        suggestion = issue_to_suggestion.get(issue, f"Address format issue: {issue}")
        suggestions.append(suggestion)
    
    return suggestions

# --- Flask Routes ---
@app.route('/')
def health_check():
    return jsonify({"status": "AI Service Running!"})

@app.route('/analyze-resume-jd', methods=['POST'])
def analyze_resume_jd():
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file provided"}), 400
    if 'jobDescription' not in request.form:
        return jsonify({"error": "No job description provided"}), 400

    resume_file = request.files['resume']
    job_description_text = request.form['jobDescription']

    if resume_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    file_extension = os.path.splitext(resume_file.filename)[1].lower()

    if file_extension not in ['.pdf', '.docx']:
        return jsonify({"error": "Unsupported file type. Please upload PDF or DOCX."}), 400

    try:
        # 1. Extract text from resume
        file_stream = io.BytesIO(resume_file.read())
        extracted_resume_text = extract_text_from_doc(file_stream, file_extension)
        
        if not extracted_resume_text:
            return jsonify({"error": "Failed to extract text from resume."}), 500

        # 2. Perform job matching analysis
        job_matching_results = perform_job_matching(extracted_resume_text, job_description_text)
        
        # 3. Perform format analysis
        format_analysis = check_resume_format(extracted_resume_text)
        format_suggestions = generate_format_suggestions(format_analysis["format_issues"])
        
        # 4. Extract structured data from resume
        resume_structured_data = extract_resume_structured_data(extracted_resume_text)
        
        # 5. Generate missing keywords analysis
        missing_keywords = find_missing_keywords(
            job_matching_results.get("jd_keywords_extracted", []),
            job_matching_results.get("resume_keywords_extracted", [])
        )
        
        # 6. Combine format and content scoring
        content_score = job_matching_results.get("matchScore", 0)
        format_score = format_analysis.get("format_score", 0)
        
        # Weighted overall score (70% content matching, 30% format)
        overall_score = (content_score * 0.7) + (format_score * 0.3)
        
        # 7. Generate comprehensive feedback
        feedback = generate_comprehensive_feedback(
            overall_score,
            job_matching_results.get("matched_details", []),
            format_analysis["format_issues"],
            missing_keywords
        )

        # 8. Build complete response matching your Node.js structure
        complete_response = {
            "structured": {
                "keywords": convert_matched_details_to_keywords(job_matching_results.get("matched_details", [])),
                "missingKeywords": missing_keywords,
                "formatIssues": format_analysis["format_issues"],
                "suggestions": format_suggestions + generate_content_suggestions(missing_keywords)
            },
            "matchScore": round(overall_score, 2),
            "feedback": feedback,
            "resumeData": resume_structured_data,
            "analysis_details": {
                "content_match_score": content_score,
                "format_score": format_score,
                "total_format_issues": format_analysis["total_issues"],
                "resume_keywords_count": len(job_matching_results.get("resume_keywords_extracted", [])),
                "jd_keywords_count": len(job_matching_results.get("jd_keywords_extracted", [])),
                "matched_keywords_count": len(job_matching_results.get("matched_details", []))
            },
            "debug_info": {
                "extracted_resume_text_length": len(extracted_resume_text),
                "job_description_text_length": len(job_description_text),
                "resume_keywords_extracted": job_matching_results.get("resume_keywords_extracted", [])[:10],  # First 10 for debugging
                "jd_keywords_extracted": job_matching_results.get("jd_keywords_extracted", [])[:10]
            }
        }

        return jsonify(complete_response)

    except Exception as e:
        app.logger.error(f"Error processing resume and job description: {e}", exc_info=True)
        return jsonify({"error": f"An error occurred during processing: {str(e)}"}), 500

# Add these helper functions to support the enhanced route:

def extract_resume_structured_data(resume_text):
    """Extract structured data from resume text."""
    try:
        structured_data = {
            "personalInfo": extract_personal_info(resume_text),
            "education": extract_education_details(resume_text),
            "experience": extract_experience_details(resume_text),
            "skills": extract_skills_list(resume_text),
            "certifications": extract_certifications(resume_text)
        }
        return structured_data
    except Exception as e:
        logging.error(f"Error extracting structured data: {e}")
        return {}

def extract_personal_info(text):
    """Extract personal information from resume."""
    info = {}
    
    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email_match = re.search(email_pattern, text)
    if email_match:
        info["email"] = email_match.group()
    
    # Extract phone
    phone_patterns = [
        r'\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
        r'\(\d{3}\)\s?\d{3}-?\d{4}'
    ]
    for pattern in phone_patterns:
        phone_match = re.search(pattern, text)
        if phone_match:
            info["phone"] = phone_match.group()
            break
    
    # Extract name (simple heuristic - first line that looks like a name)
    lines = text.split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        if line and len(line.split()) <= 4 and len(line) > 5:
            if not re.search(r'@|\.com|phone|email|\d', line.lower()):
                info["name"] = line
                break
    
    return info

def extract_education_details(text):
    """Extract education information."""
    education = []
    
    # Look for education section
    education_section = extract_section_content(text, ['education', 'academic background'])
    if not education_section:
        return education
    
    # Find degree patterns
    degree_patterns = [
        r'(bachelor|master|phd|b\.?s|m\.?s|b\.?a|m\.?a|doctorate)[\w\s]*',
        r'(diploma|certificate)[\w\s]*'
    ]
    
    # Find years
    year_pattern = r'\b(19|20)\d{2}\b'
    years = re.findall(year_pattern, education_section)
    
    # Find institutions
    institution_pattern = r'(university|college|institute|school)[\w\s]*'
    institutions = re.findall(institution_pattern, education_section, re.IGNORECASE)
    
    # Combine findings (simplified)
    if years or institutions:
        education.append({
            "degree": "Degree information found",
            "institution": institutions[0] if institutions else "Institution found",
            "year": years[-1] if years else "Year found"
        })
    
    return education

def extract_experience_details(text):
    """Extract work experience information."""
    experience = []
    
    # Look for experience section
    exp_section = extract_section_content(text, ['experience', 'work experience', 'employment'])
    if not exp_section:
        return experience
    
    # Find common job titles
    job_title_patterns = [
        r'(senior|junior|lead|principal)?\s*(developer|engineer|manager|analyst|consultant|specialist|director)',
        r'(software|web|data|system|project|fullstack|frontend|backend|wordpress)\s*(developer|engineer|manager|analyst)'
    ]
    
    titles = []
    for pattern in job_title_patterns:
        matches = re.findall(pattern, exp_section, re.IGNORECASE)
        titles.extend([' '.join(match).strip() for match in matches if any(match)])
    
    # Find years/dates
    date_patterns = [
        r'\b(19|20)\d{2}\b',
        r'\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(19|20)\d{2}\b'
    ]
    
    dates = []
    for pattern in date_patterns:
        dates.extend(re.findall(pattern, exp_section, re.IGNORECASE))
    
    # Create experience entries
    if titles or dates:
        experience.append({
            "title": titles[0] if titles else "Position found",
            "company": "Company information found",
            "date": f"{dates[0]} - {dates[-1]}" if len(dates) >= 2 else dates[0] if dates else "Date found"
        })
    
    return experience

def extract_skills_list(text):
    """Extract skills from resume."""
    skills_section = extract_section_content(text, ['skills', 'technical skills', 'competencies'])
    if not skills_section:
        return []
    
    # Common technical skills
    common_skills = [
        'python', 'java', 'javascript', 'react', 'node', 'sql', 'aws', 'azure',  'mern','spring boot' ,'django','nextjs', 'vue','angular','.net','nodejs','expressjs',
        'docker', 'kubernetes', 'git', 'linux', 'agile', 'scrum', 'html', 'css','flask','sonerqueue','selenium','php','laveral','c++','c','kotlin','react-native','flutter',
        'mongodb', 'mysql', 'postgresql', 'redis', 'elasticsearch', 'tensorflow','powerbi','pandas','numpy','openai','wordpress','back-end',
        'pytorch', 'machine learning', 'data science', 'artificial intelligence','REST API','javascript familiarity','database'
    ]
    
    found_skills = []
    text_lower = skills_section.lower()
    
    for skill in common_skills:
        if skill in text_lower:
            found_skills.append(skill.title())
    
    return found_skills

def extract_certifications(text):
    """Extract certifications from resume."""
    cert_section = extract_section_content(text, ['certifications', 'certificates', 'qualifications'])
    if not cert_section:
        return []
    
    # Look for certification patterns
    cert_patterns = [
        r'(aws|azure|google cloud|gcp)\s*(certified|certification)',
        r'(pmp|cissp|comptia|cisco|microsoft)\s*\w*',
        r'certified\s*\w+\s*(professional|associate|expert)'
    ]
    
    certifications = []
    for pattern in cert_patterns:
        matches = re.findall(pattern, cert_section, re.IGNORECASE)
        certifications.extend([match if isinstance(match, str) else ' '.join(match) for match in matches])
    
    return certifications

def extract_section_content(text, section_keywords):
    """Extract content from a specific section."""
    text_lower = text.lower()
    
    for keyword in section_keywords:
        # Find section start
        pattern = rf'{keyword}[:\s]+(.*?)(?=\n\s*\n|\n[A-Z][A-Za-z\s]+:|\Z)'
        match = re.search(pattern, text_lower, re.DOTALL)
        if match:
            return match.group(1).strip()
    
    return ""

def find_missing_keywords(jd_keywords, resume_keywords):
    """Find keywords from job description that are missing in resume."""
    if not jd_keywords or not resume_keywords:
        return []
    
    jd_set = set([kw.lower() for kw in jd_keywords])
    resume_set = set([kw.lower() for kw in resume_keywords])
    
    missing = list(jd_set - resume_set)
    return missing[:10]  # Return top 10 missing keywords

def convert_matched_details_to_keywords(matched_details):
    """Convert matched details to keyword format for frontend."""
    keywords = []
    
    for detail in matched_details:
        keywords.append({
            "word": detail.get("resume_keyword", ""),
            "count": 1,  # Simplified
            "matches": True,
            "importance": "required",  # Default
            "similarity": detail.get("similarity_score", 0)
        })
    
    return keywords

def generate_content_suggestions(missing_keywords):
    """Generate content-based suggestions."""
    suggestions = []
    
    if missing_keywords:
        suggestions.append(f"Consider adding these relevant skills: {', '.join(missing_keywords[:5])}")
        suggestions.append("Highlight projects or experience related to the missing skills")
        suggestions.append("Use specific examples that demonstrate your expertise in key areas")
    
    return suggestions

def generate_comprehensive_feedback(score, matched_details, format_issues, missing_keywords):
    """Generate comprehensive feedback based on analysis."""
    feedback_parts = []
    
    # Score-based feedback
    if score >= 80:
        feedback_parts.append("Excellent match! Your resume aligns well with the job requirements.")
    elif score >= 60:
        feedback_parts.append("Good match with room for improvement in key areas.")
    elif score >= 40:
        feedback_parts.append("Moderate match. Consider highlighting more relevant experience.")
    else:
        feedback_parts.append("Low match. Significant improvements needed to align with job requirements.")
    
    # Keyword match feedback
    if matched_details:
        feedback_parts.append(f"Found {len(matched_details)} matching skills/keywords.")
    
    # Missing keywords feedback
    if missing_keywords:
        feedback_parts.append(f"Consider adding {len(missing_keywords)} key skills mentioned in the job description.")
    
    # Format feedback
    if format_issues:
        feedback_parts.append(f"Address {len(format_issues)} formatting issues for better presentation.")
    
    return " ".join(feedback_parts)