# Flask API for Resume Analysis and Placement Prediction
from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import io
import random
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mock model and explainer (In production, load your trained model here)
class MockModel:
    """Mock machine learning model for demonstration"""
    
    def predict_proba(self, features):
        """Mock prediction - returns random probability"""
        # In production, this would be your trained model's prediction
        return [[1 - random.uniform(0.5, 0.95), random.uniform(0.5, 0.95)]]
    
    def predict(self, features):
        """Mock prediction - returns class"""
        proba = self.predict_proba(features)
        return [1 if proba[0][1] > 0.5 else 0]

class MockExplainer:
    """Mock SHAP explainer for demonstration"""
    
    def shap_values(self, features):
        """Mock SHAP values - returns random feature importance"""
        # In production, this would be your SHAP explainer
        # Removed Certifications, focusing on core factors
        return {
            'CGPA': round(random.uniform(0.2, 0.5), 3),
            'Internships': round(random.uniform(0.15, 0.35), 3),
            'Projects': round(random.uniform(0.1, 0.25), 3),
            'Skills': round(random.uniform(0.1, 0.3), 3),
            'Communication': round(random.uniform(-0.15, 0.15), 3)
        }

# Initialize mock model and explainer
model = MockModel()
explainer = MockExplainer()

def extract_text_from_pdf(file):
    """Extract text content from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        raise Exception(f"Error reading PDF: {str(e)}")

def parse_resume_features(text):
    """
    Parse resume text and extract features
    In production, implement sophisticated NLP-based feature extraction
    """
    # Convert to lowercase for easier matching
    text_lower = text.lower()
    
    # Mock feature extraction
    # In production, use NLP libraries like spaCy, NLTK, or transformer models
    
    features = {
        'cgpa': 0.0,
        'internships': 0,
        'projects': 0,
        'skills_count': 0,
        'certifications': 0,
        'experience_months': 0
    }
    
    # Try to extract CGPA/GPA (simple regex pattern)
    cgpa_pattern = r'(?:cgpa|gpa|grade)[:\s]*(\d+\.?\d*)'
    cgpa_match = re.search(cgpa_pattern, text_lower)
    if cgpa_match:
        features['cgpa'] = float(cgpa_match.group(1))
    else:
        features['cgpa'] = random.uniform(6.5, 9.5)  # Mock value
    
    # Count internships
    features['internships'] = text_lower.count('intern')
    
    # Count projects
    features['projects'] = text_lower.count('project')
    
    # Count common technical skills
    skills = ['python', 'java', 'javascript', 'react', 'sql', 'machine learning', 
              'data science', 'c++', 'git', 'aws', 'docker']
    features['skills_count'] = sum(1 for skill in skills if skill in text_lower)
    
    # Count certifications
    features['certifications'] = text_lower.count('certificate') + text_lower.count('certification')
    
    return features

def generate_weak_skills(features, shap_values, probability, text=""):
    """
    Generate weak_skills array based on SHAP values and feature thresholds
    Returns array of objects with skill_name, current_score, and message
    Now includes specific technical skills like Java, Python, DSA instead of generic Certifications
    """
    weak_skills = []
    
    # Define thresholds for identifying weak skills
    SHAP_THRESHOLD = 0.15
    
    # Map feature names to user-friendly skill names and calculate scores
    skill_mapping = {
        'CGPA': {'name': 'Academic Performance', 'feature_value': features.get('cgpa', 0)},
        'Internships': {'name': 'Internship Experience', 'feature_value': features.get('internships', 0)},
        'Projects': {'name': 'Project Portfolio', 'feature_value': features.get('projects', 0)},
        'Skills': {'name': 'Technical Skills', 'feature_value': features.get('skills_count', 0)},
        'Communication': {'name': 'Communication Skills', 'feature_value': random.randint(40, 80)}
    }
    
    # Check for specific technical skills in resume text
    text_lower = text.lower() if text else ""
    technical_skills = {
        'Java': 'java' in text_lower and 'javascript' not in text_lower.replace('java', '', 1),
        'Python': 'python' in text_lower,
        'Data Structures & Algorithms': any(term in text_lower for term in ['dsa', 'data structure', 'algorithm', 'leetcode', 'coding']),
        'JavaScript': 'javascript' in text_lower or 'js' in text_lower,
        'C++': 'c++' in text_lower or 'cpp' in text_lower,
        'SQL': 'sql' in text_lower or 'database' in text_lower,
        'React': 'react' in text_lower,
        'Machine Learning': 'machine learning' in text_lower or 'ml' in text_lower,
        'System Design': 'system design' in text_lower or 'architecture' in text_lower,
    }
    
    # Iterate over SHAP values to identify weak skills
    for shap_key, shap_value in shap_values.items():
        if shap_key == 'Certifications':
            # Skip Certifications - we'll handle technical skills separately
            continue
            
        if abs(shap_value) < SHAP_THRESHOLD:
            skill_info = skill_mapping.get(shap_key, {'name': shap_key, 'feature_value': 50})
            
            # Calculate current score (normalize to 0-100 scale)
            if shap_key == 'CGPA':
                current_score = int((skill_info['feature_value'] / 10) * 100)
            elif shap_key == 'Internships':
                current_score = min(100, skill_info['feature_value'] * 25)
            elif shap_key == 'Projects':
                current_score = min(100, skill_info['feature_value'] * 20)
            elif shap_key == 'Skills':
                current_score = min(100, skill_info['feature_value'] * 10)
            else:
                current_score = skill_info['feature_value']
            
            # Add to weak_skills array if score is below 70
            if current_score < 70:
                weak_skills.append({
                    'skill_name': skill_info['name'],
                    'current_score': current_score,
                    'message': f"Your {skill_info['name']} score is below the threshold. Take a skill test to prove your abilities!"
                })
    
    # Add specific technical skills that are missing or weak
    for tech_skill, is_present in technical_skills.items():
        if not is_present:
            # Generate a random score between 30-60 for missing skills
            weak_score = random.randint(30, 60)
            weak_skills.append({
                'skill_name': tech_skill,
                'current_score': weak_score,
                'message': f"No evidence of {tech_skill} found in your resume. Take a test to prove your knowledge!"
            })
    
    return weak_skills

def generate_recommendations(features, probability):
    """Generate personalized recommendations based on features and prediction"""
    recommendations = []
    
    if features['cgpa'] < 7.5:
        recommendations.append("Focus on improving your academic performance to reach at least 7.5 CGPA")
    
    if features['internships'] < 2:
        recommendations.append("Gain more practical experience through internships at reputable companies")
    
    if features['projects'] < 3:
        recommendations.append("Build more hands-on projects and showcase them on GitHub")
    
    if features['skills_count'] < 5:
        recommendations.append("Expand your technical skill set by learning in-demand technologies")
    
    if features['certifications'] < 2:
        recommendations.append("Earn industry-recognized certifications to validate your skills")
    
    recommendations.append("Practice coding on platforms like LeetCode and HackerRank")
    recommendations.append("Improve your soft skills through mock interviews and communication workshops")
    recommendations.append("Build a strong LinkedIn profile and network with industry professionals")
    
    # Return top 5 recommendations
    return recommendations[:5]

def determine_track(features, probability):
    """Determine recommended career track based on features"""
    tracks = [
        'Software Developer',
        'Data Analyst',
        'Full Stack Developer',
        'Machine Learning Engineer',
        'DevOps Engineer',
        'Frontend Developer',
        'Backend Developer',
        'Business Analyst'
    ]
    
    # Simple logic - in production, use model-based recommendation
    if 'python' in str(features).lower() and features.get('projects', 0) > 2:
        return 'Data Analyst'
    elif features.get('skills_count', 0) > 5:
        return 'Full Stack Developer'
    else:
        return random.choice(tracks)

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'status': 'online',
        'message': 'AI Placement Predictor API is running',
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Main prediction endpoint
    Expects: PDF file in 'resume' field
    Returns: Placement probability, recommendations, and SHAP values
    """
    try:
        # Check if file is present
        if 'resume' not in request.files:
            return jsonify({'error': 'No resume file provided'}), 400
        
        file = request.files['resume']
        
        # Check if file is PDF
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are supported'}), 400
        
        # Extract text from PDF
        pdf_content = io.BytesIO(file.read())
        resume_text = extract_text_from_pdf(pdf_content)
        
        if not resume_text.strip():
            return jsonify({'error': 'Could not extract text from PDF'}), 400
        
        # Parse features from resume
        features = parse_resume_features(resume_text)
        
        # Make prediction
        # In production, convert features to proper format for your model
        feature_vector = [
            features['cgpa'],
            features['internships'],
            features['projects'],
            features['skills_count'],
            features['certifications']
        ]
        
        # Get probability
        probability_array = model.predict_proba([feature_vector])
        probability = int(probability_array[0][1] * 100)
        
        # Get SHAP values
        shap_values = explainer.shap_values([feature_vector])
        
        # Generate weak_skills array (NEW) - pass resume_text for technical skill detection
        weak_skills = generate_weak_skills(features, shap_values, probability, resume_text)
        
        # Determine recommended track
        recommended_track = determine_track(features, probability)
        
        # Calculate confidence
        confidence = min(95, probability + random.randint(-5, 10))
        
        # Prepare response
        response = {
            'probability': probability,
            'recommended_track': recommended_track,
            'confidence': confidence,
            'weak_skills': weak_skills,  # NEW: replaced recommendations
            'shap_values': shap_values,
            'features_extracted': {
                'cgpa': round(features['cgpa'], 2),
                'internships': features['internships'],
                'projects': features['projects'],
                'skills': features['skills_count'],
                'certifications': features['certifications']
            }
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/re-predict', methods=['POST'])
def re_predict():
    """
    Re-prediction endpoint after skill test
    Expects JSON: { "userId": "...", "skillName": "...", "newScore": 85, "originalProbability": 68 }
    Returns: Updated prediction with new_probability, new_shap_values, new_weak_skills
    """
    try:
        # Get JSON data
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        user_id = data.get('userId')
        skill_name = data.get('skillName')
        new_score = data.get('newScore')
        original_probability = data.get('originalProbability', 50)  # Default to 50 if not provided
        
        # Validate inputs
        if not all([user_id, skill_name, new_score]):
            return jsonify({'error': 'Missing required fields: userId, skillName, newScore'}), 400
        
        # Mock: Fetch user's original features (in production, get from database)
        # For now, generate mock features
        features = {
            'cgpa': random.uniform(7.0, 9.0),
            'internships': random.randint(1, 3),
            'projects': random.randint(2, 5),
            'skills_count': random.randint(3, 8),
            'certifications': random.randint(0, 3)
        }
        
        # Update the specific skill based on newScore
        # Map skill names to feature keys (updated with technical skills)
        skill_to_feature_map = {
            'Academic Performance': 'cgpa',
            'Internship Experience': 'internships',
            'Project Portfolio': 'projects',
            'Technical Skills': 'skills_count',
            'Communication Skills': 'communication',
            # Technical skills map to skills_count
            'Java': 'skills_count',
            'Python': 'skills_count',
            'Data Structures & Algorithms': 'skills_count',
            'JavaScript': 'skills_count',
            'C++': 'skills_count',
            'SQL': 'skills_count',
            'React': 'skills_count',
            'Machine Learning': 'skills_count',
            'System Design': 'skills_count'
        }
        
        # Update feature based on new score (convert 0-100 score back to feature scale)
        feature_key = skill_to_feature_map.get(skill_name)
        if feature_key:
            if feature_key == 'cgpa':
                features['cgpa'] = (new_score / 100) * 10  # Convert back to 0-10 scale
            elif feature_key == 'internships':
                features['internships'] = int(new_score / 25)  # Convert back
            elif feature_key == 'projects':
                features['projects'] = int(new_score / 20)
            elif feature_key == 'skills_count':
                # For technical skills, increase skills_count based on test performance
                features['skills_count'] = min(11, features.get('skills_count', 3) + int(new_score / 50))
        
        # Create feature vector for model
        feature_vector = [
            features['cgpa'],
            features['internships'],
            features['projects'],
            features['skills_count'],
            features.get('certifications', 0)  # Keep for backward compatibility
        ]
        
        # Re-run prediction with updated features
        probability_array = model.predict_proba([feature_vector])
        base_new_probability = int(probability_array[0][1] * 100)
        
        # Calculate improvement based on test score
        # Higher test score = more improvement (0-20% boost)
        improvement = int((new_score / 100) * 20)
        
        # Calculate final new probability (original + improvement)
        new_probability = min(100, original_probability + improvement)
        
        # Get new SHAP values
        new_shap_values = explainer.shap_values([feature_vector])
        
        # Generate new weak_skills array
        new_weak_skills = generate_weak_skills(features, new_shap_values, new_probability)
        
        # Determine new recommended track
        new_recommended_track = determine_track(features, new_probability)
        
        # Calculate new confidence
        new_confidence = min(95, new_probability + random.randint(-5, 10))
        
        # Prepare response
        response = {
            'new_probability': new_probability,
            'new_recommended_track': new_recommended_track,
            'new_confidence': new_confidence,
            'new_shap_values': new_shap_values,
            'new_weak_skills': new_weak_skills,
            'improvement': improvement,
            'original_probability': original_probability,
            'message': f'Great job! Your {skill_name} skill has improved. Your placement probability increased from {original_probability}% to {new_probability}%!'
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        print(f"Error in re-prediction: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

@app.route('/health')
def health():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': True,
        'explainer_loaded': True
    })

if __name__ == '__main__':
    # Run the Flask app
    # In production, use gunicorn instead
    app.run(host='0.0.0.0', port=8080, debug=True)
