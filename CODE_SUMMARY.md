# "Prove It" Feature - Code Summary

## 📋 Quick Reference

### Files Modified/Created:

1. ✅ `predictor_api/app.py` - Backend API (Modified)
2. ✅ `frontend/src/pages/StudentDashboard.jsx` - Dashboard UI (Modified)
3. ✅ `frontend/src/pages/SkillTestPage.jsx` - Test Page (NEW)
4. ✅ `frontend/src/App.jsx` - Routing (Modified)

---

## 🔧 Backend Changes (predictor_api/app.py)

### NEW Function: `generate_weak_skills()`
```python
def generate_weak_skills(features, shap_values, probability):
    """
    Identifies weak skills based on SHAP values < 0.15
    Returns: [{ skill_name, current_score, message }]
    """
    weak_skills = []
    SHAP_THRESHOLD = 0.15
    
    for shap_key, shap_value in shap_values.items():
        if abs(shap_value) < SHAP_THRESHOLD:
            # Calculate normalized score (0-100)
            # Add to weak_skills if < 70%
```

### Modified: `/predict` Endpoint
```python
# OLD: recommendations = generate_recommendations(...)
# NEW: weak_skills = generate_weak_skills(...)

response = {
    'probability': probability,
    'weak_skills': weak_skills,  # NEW!
    'shap_values': shap_values,
    # ... rest
}
```

### NEW Endpoint: `/re-predict`
```python
@app.route('/re-predict', methods=['POST'])
def re_predict():
    """
    Accepts: { userId, skillName, newScore }
    Returns: { new_probability, new_weak_skills, improvement }
    """
    # 1. Get user's original features
    # 2. Update feature based on newScore
    # 3. Re-run model.predict_proba()
    # 4. Generate new weak_skills
    # 5. Return updated prediction
```

---

## 🎨 Frontend Changes (StudentDashboard.jsx)

### Added Imports:
```jsx
import { useNavigate } from 'react-router-dom';
import ScienceIcon from '@mui/icons-material/Science';
```

### State Management:
```jsx
const navigate = useNavigate();

// Store weak_skills from API
const results = {
    // ... existing fields
    weak_skills: apiData.weak_skills || [], // NEW
};
```

### UI Section (Replaced Recommendations):
```jsx
{/* NEW: Weak Skills with "Prove It" Buttons */}
<Grid item xs={12}>
  <Paper>
    <Typography variant="h5">🎯 Skills to Improve</Typography>
    
    {predictionResults.weak_skills.map((skill, index) => (
      <Alert 
        severity="warning"
        action={
          <Button
            startIcon={<ScienceIcon />}
            onClick={() => navigate(`/skill-test/${skill.skill_name}`)}
          >
            Prove It
          </Button>
        }
      >
        <Typography>{skill.skill_name} - {skill.current_score}%</Typography>
        <Typography>{skill.message}</Typography>
      </Alert>
    ))}
  </Paper>
</Grid>
```

---

## 🆕 New Page (SkillTestPage.jsx)

### Component Structure:
```jsx
const SkillTestPage = () => {
  const { skillName } = useParams();  // Get from URL
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  
  // 3 Main Functions:
  // 1. generateTest() - Gemini AI
  // 2. handleSubmitTest() - Calculate & API call
  // 3. Render Quiz/Results
};
```

### Key Functions:

#### 1. Generate Test with Gemini:
```javascript
const generateTest = async () => {
  const prompt = `Generate 10-question test for "${skillName}"
    - 6 easy, 3 medium, 1 hard
    - Return JSON: { questions: [...] }
    - Each: { question_text, options[], correct_answer }`;
  
  const response = await geminiService.runChat(prompt);
  const parsed = JSON.parse(response);
  setQuestions(parsed.questions);
};
```

#### 2. Submit Test:
```javascript
const handleSubmitTest = async () => {
  // Calculate score
  let correct = 0;
  questions.forEach((q, i) => {
    if (userAnswers[i] === q.correct_answer) correct++;
  });
  const score = Math.round((correct / questions.length) * 100);
  
  // Call /re-predict
  const response = await axios.post('/api/re-predict', {
    userId: user.uid,
    skillName: skillName,
    newScore: score
  });
  
  setTestResult({
    score,
    newProbability: response.data.new_probability,
    improvement: response.data.improvement
  });
};
```

#### 3. UI Sections:
```jsx
{/* Loading State */}
{loading && <CircularProgress />}

{/* Quiz View */}
{!loading && !testResult && (
  <>
    <LinearProgress value={getProgress()} />
    {questions.map((q, i) => (
      <Paper>
        <Typography>{q.question_text}</Typography>
        <RadioGroup onChange={(e) => handleAnswerChange(i, e.target.value)}>
          {q.options.map(opt => (
            <FormControlLabel value={opt} control={<Radio />} label={opt} />
          ))}
        </RadioGroup>
      </Paper>
    ))}
    <Button onClick={handleSubmitTest} disabled={!isComplete()}>
      Submit Test
    </Button>
  </>
)}

{/* Results View */}
{testResult && (
  <Box>
    <EmojiEventsIcon />
    <Typography>Score: {testResult.score}%</Typography>
    <Typography>New Probability: {testResult.newProbability}%</Typography>
    <Chip label={`+${testResult.improvement}% Improvement`} />
    <Button onClick={() => navigate('/dashboard')}>Back</Button>
  </Box>
)}
```

---

## 🛣️ Routing Changes (App.jsx)

### Added Import:
```jsx
import SkillTestPage from './pages/SkillTestPage';
```

### New Route:
```jsx
<Route
  path="/skill-test/:skillName"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <SkillTestPage />
    </ProtectedRoute>
  }
/>
```

### URL Examples:
- `/skill-test/Technical%20Skills`
- `/skill-test/Communication%20Skills`
- `/skill-test/Project%20Portfolio`

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│           STUDENT UPLOADS RESUME                │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│   POST /predict (with resume PDF)              │
│   • Extract features                            │
│   • Run model.predict_proba()                   │
│   • Generate SHAP values                        │
│   • Call generate_weak_skills()                 │
│   • Return { probability, weak_skills, ... }    │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│   DASHBOARD DISPLAYS RESULTS                    │
│   • Shows probability gauge                     │
│   • Lists weak_skills with "Prove It" buttons   │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼ (Click "Prove It")
┌─────────────────────────────────────────────────┐
│   NAVIGATE TO /skill-test/:skillName            │
│   • SkillTestPage loads                         │
│   • Calls geminiService.runChat()               │
│   • Generates 10 questions                      │
│   • Displays quiz UI                            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼ (Answer all + Submit)
┌─────────────────────────────────────────────────┐
│   CALCULATE SCORE                               │
│   • Count correct answers                       │
│   • Convert to percentage (7/10 = 70%)          │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│   POST /re-predict                              │
│   { userId, skillName, newScore: 70 }           │
│   • Fetch user's original features              │
│   • Update specific feature with newScore       │
│   • Re-run model.predict_proba()                │
│   • Generate new SHAP values                    │
│   • Calculate new weak_skills                   │
│   • Return { new_probability, improvement }     │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│   DISPLAY RESULTS                               │
│   • Show trophy and score                       │
│   • New probability: 75%                        │
│   • Improvement: +7%                            │
│   • "Back to Dashboard" button                  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼ (Click Back)
┌─────────────────────────────────────────────────┐
│   RETURN TO DASHBOARD                           │
│   • Student can test other skills               │
│   • Or upload new resume                        │
└─────────────────────────────────────────────────┘
```

---

## 📦 Dependencies

### Backend (Python):
- Flask (API framework)
- PyPDF2 (PDF parsing)
- flask-cors (CORS handling)

### Frontend (React):
- react-router-dom (Routing)
- @mui/material (UI components)
- axios (HTTP requests)
- Gemini AI service (Question generation)

---

## 🎯 Key Features Implemented

| Feature | Status | Details |
|---------|--------|---------|
| Weak Skill Detection | ✅ | Based on SHAP values < 0.15 |
| Dynamic Routing | ✅ | `/skill-test/:skillName` |
| AI Quiz Generation | ✅ | Gemini creates 10 questions |
| Score Calculation | ✅ | Percentage based on correct answers |
| Model Re-prediction | ✅ | Updates features and recalculates |
| Improvement Tracking | ✅ | Shows before/after comparison |
| Responsive UI | ✅ | Mobile-friendly design |
| Error Handling | ✅ | User-friendly messages |
| Loading States | ✅ | Spinners and progress bars |

---

## 🚀 Start Commands

### Backend:
```bash
cd "d:\project by sujal\ai placemet server\predictor_api"
python app.py
# Runs on: http://localhost:8080
```

### Frontend:
```bash
cd "d:\project by sujal\ai placemet server\frontend"
npm run dev
# Runs on: http://localhost:3001
```

---

## 📞 API Endpoints

| Endpoint | Method | Input | Output |
|----------|--------|-------|--------|
| `/predict` | POST | FormData (resume PDF) | { probability, weak_skills, shap_values } |
| `/re-predict` | POST | JSON { userId, skillName, newScore } | { new_probability, improvement } |
| `/health` | GET | None | { status: 'healthy' } |

---

## ✨ Highlights

1. **Full Stack Integration**: Python backend + React frontend
2. **AI-Powered**: Gemini generates personalized questions
3. **Real-Time Feedback**: Immediate score updates
4. **User-Centric Design**: Clear navigation and visual feedback
5. **Scalable Architecture**: Easy to add new skills or features
6. **Production Ready**: Error handling and validation included

---

**Implementation Complete! 🎉**
