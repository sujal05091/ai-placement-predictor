# Quick Testing Guide - "Prove It" Feature

## 🚀 Start Both Servers

### Terminal 1 - Backend (Flask API)
```powershell
cd "d:\project by sujal\ai placemet server\predictor_api"
python app.py
```
Expected output: `Running on http://0.0.0.0:8080`

### Terminal 2 - Frontend (React + Vite)
```powershell
cd "d:\project by sujal\ai placemet server\frontend"
npm run dev
```
Expected output: `Local: http://localhost:3001/`

---

## ✅ Test Checklist

### 1. Test Backend APIs Directly

**Test /predict endpoint:**
```powershell
curl -X POST http://localhost:8080/predict `
  -F "resume=@sample_resume.pdf"
```

**Expected JSON response includes:**
```json
{
  "probability": 68,
  "weak_skills": [
    {
      "skill_name": "Technical Skills",
      "current_score": 40,
      "message": "Your Technical Skills score is below..."
    }
  ]
}
```

**Test /re-predict endpoint:**
```powershell
curl -X POST http://localhost:8080/re-predict `
  -H "Content-Type: application/json" `
  -d '{\"userId\": \"test123\", \"skillName\": \"Technical Skills\", \"newScore\": 85}'
```

**Expected response includes:**
```json
{
  "new_probability": 75,
  "improvement": 7,
  "new_weak_skills": [...]
}
```

---

### 2. Test Frontend Flow

**Step-by-Step:**

1. **Open App**: http://localhost:3001
2. **Login**: Use Google or Email/Password
3. **Dashboard**: Navigate to `/dashboard`
4. **Upload Resume**: 
   - Click "Choose PDF File"
   - Select a PDF resume
   - Click "Analyze My Employability"
   - Wait 60-90 seconds
5. **View Results**:
   - Check "Placement Probability" gauge
   - Scroll to "Skills to Improve" section
   - Verify weak skills display with "Prove It" buttons
6. **Take Test**:
   - Click any "Prove It" button
   - Wait 10-15 seconds for questions to generate
   - Answer all 10 questions
   - Click "Submit Test"
7. **View Improvement**:
   - See trophy and score
   - Check new placement probability
   - Click "Back to Dashboard"

---

### 3. Check Browser Console

**Open DevTools (F12) and look for:**
```
📊 Raw API Response: {...}
📊 Transformed Results: {...}
🤖 Generating test for skill: Technical Skills
📝 Raw Gemini Response: {...}
✅ Test Score: 7/10 = 70%
📊 Re-prediction Response: {...}
```

---

### 4. Verify UI Elements

**Dashboard - Skills to Improve Section:**
- [ ] Orange alert boxes for each weak skill
- [ ] Skill name and current score displayed
- [ ] "Prove It" button with science icon
- [ ] Button navigates to `/skill-test/[skill-name]`

**Skill Test Page:**
- [ ] Skill name chip at top
- [ ] Progress bar showing answered/total
- [ ] 10 questions with radio buttons
- [ ] Submit button disabled until all answered
- [ ] Loading spinner during submission

**Results Page:**
- [ ] Trophy icon displayed
- [ ] Score shown as percentage
- [ ] New placement probability
- [ ] Improvement badge (if positive)
- [ ] Back button returns to dashboard

---

## 🐛 Common Issues & Fixes

### Issue: "Failed to generate test"
**Fix**: Check Gemini API key in `.env` file
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

### Issue: "Cannot reach the server"
**Fix**: Verify Flask API is running on port 8080
```powershell
netstat -an | findstr "8080"
```

### Issue: Questions not parsing
**Fix**: Check browser console for JSON parse errors. Gemini sometimes returns markdown-wrapped JSON.

### Issue: "Prove It" button not working
**Fix**: Check browser console for navigation errors. Ensure React Router is configured correctly.

### Issue: Score not updating
**Fix**: Verify `/re-predict` endpoint is being called. Check Network tab in DevTools.

---

## 📸 Expected Screenshots

### 1. Dashboard with Weak Skills
![Expected: Orange alerts with "Prove It" buttons]

### 2. Skill Test Page
![Expected: Questions with progress bar]

### 3. Results Page
![Expected: Trophy with new probability]

---

## 🎯 Success Criteria

✅ Backend returns `weak_skills` array  
✅ Dashboard displays "Prove It" buttons  
✅ Clicking button navigates to skill test  
✅ Gemini generates 10 questions  
✅ User can answer all questions  
✅ Submit calculates score correctly  
✅ `/re-predict` API updates probability  
✅ Results page shows improvement  
✅ Back button returns to dashboard  

---

## 📝 Test Data

### Sample Weak Skills Response:
```json
{
  "weak_skills": [
    {
      "skill_name": "Technical Skills",
      "current_score": 40,
      "message": "Your Technical Skills score is below the threshold."
    },
    {
      "skill_name": "Communication Skills",
      "current_score": 55,
      "message": "Low Communication skill detected."
    }
  ]
}
```

### Sample Test Questions:
```json
{
  "questions": [
    {
      "question_text": "What is React?",
      "options": ["A library", "A framework", "A language", "A database"],
      "correct_answer": "A library"
    }
  ]
}
```

---

## 🔄 Testing Different Scenarios

### Scenario 1: No Weak Skills
- Upload resume with high scores
- Verify success message: "All skills above threshold"
- No "Prove It" buttons shown

### Scenario 2: Multiple Weak Skills
- Upload resume with multiple weak areas
- Verify multiple alert boxes
- Test different skills independently

### Scenario 3: Perfect Test Score
- Answer all questions correctly
- Verify 100% score
- Check maximum probability improvement

### Scenario 4: Low Test Score
- Answer questions incorrectly
- Verify lower score percentage
- Check if probability still updates

---

## 📊 Performance Benchmarks

| Action | Expected Time |
|--------|---------------|
| Resume Analysis | 60-90 seconds |
| Question Generation | 10-15 seconds |
| Test Submission | 2-3 seconds |
| Page Navigation | < 1 second |

---

## 🎓 Demo Tips for Judge

1. **Prepare Sample Resume**: Use one with varied skill levels
2. **Pre-login**: Have account ready to save time
3. **Highlight Features**: Point out AI generation and real-time updates
4. **Show Console**: Demonstrate technical implementation
5. **Explain Flow**: Walk through complete user journey
6. **Showcase UI**: Emphasize responsive design and user experience

---

**Happy Testing! 🚀**
