# AI Placement Predictor 🎓

A comprehensive AI-powered web application for predicting student placement success, providing career guidance, and offering analytics for Training & Placement Officers (TPOs).

## 🌟 Features

### 1. **The Predictor**
- Upload resume (PDF format)
- AI-powered placement readiness analysis
- Placement probability score (0-100%)
- SHAP-based explainability showing key decision factors
- Personalized recommendations for improvement
- Recommended career track suggestion

### 2. **The AI Coach**
- Interactive AI Mock Interviewer
- Text-based chat interface
- Voice-to-Speech (Speech Recognition)
- Text-to-Speech (Voice output)
- Floating "Ask Me" chatbot for career guidance
- Powered by Google Gemini AI

### 3. **The Command Center (TPO Dashboard)**
- Embedded Power BI analytics
- Comprehensive placement statistics
- Department-wise performance tracking
- Skill gap analysis
- Predictive analytics

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **UI Library:** Material-UI (MUI)
- **Routing:** React Router v6
- **Charts:** Plotly.js
- **HTTP Client:** Axios
- **Backend (BaaS):** Firebase (Authentication + Firestore)
- **AI Integration:** Google Gemini API

### Backend (Microservice)
- **Framework:** Flask
- **ML Libraries:** scikit-learn, XGBoost, SHAP
- **PDF Processing:** PyPDF2
- **Deployment:** Docker + Google Cloud Run

## 📁 Project Structure

```
ai-placement-predictor/
├── frontend/
│   ├── public/
│   │   └── 3d-background-video.mp4
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── BackgroundVideo.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── GaugeChart.jsx
│   │   │   └── ShapChart.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── MockInterviewPage.jsx
│   │   │   ├── TPO_Dashboard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   ├── firebaseConfig.js
│   │   │   ├── authService.js
│   │   │   ├── firestoreService.js
│   │   │   └── geminiService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── predictor_api/
│   ├── models/
│   │   ├── placeholder_model.pkl
│   │   └── placeholder_explainer.pkl
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.11 or higher)
- Firebase account
- Google Cloud account (for Gemini API and Cloud Run)
- Power BI account (for TPO dashboard)

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration
   - Add your Gemini API key
   - Set the predictor API URL
   - Add Power BI embed URL

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

### Backend API Setup

1. **Navigate to predictor_api directory:**
   ```bash
   cd predictor_api
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run Flask development server:**
   ```bash
   python app.py
   ```

6. **For production deployment (Docker):**
   ```bash
   docker build -t placement-predictor-api .
   docker run -p 8080:8080 placement-predictor-api
   ```

## 🔑 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google Sign-In)
3. Create a Firestore database
4. Copy your Firebase configuration to `.env` file
5. Update Firestore security rules as needed

### Sample Firestore Structure
```
users/
  {userId}/
    - email: string
    - displayName: string
    - role: string (student/tpo)
    - lastPrediction: object
      - probability: number
      - recommendations: array
      - timestamp: timestamp
```

## 🤖 Google Gemini API Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env` file as `VITE_GEMINI_API_KEY`

## 📊 Power BI Setup

1. Create your Power BI report
2. Publish to Power BI Service
3. Get embed URL
4. Add to `.env` file as `VITE_POWER_BI_EMBED_URL`

## 🧪 Training the ML Model

The current implementation uses a mock model. To train your own model:

1. **Collect Data:**
   - Student resumes
   - Placement outcomes
   - Feature labels (CGPA, internships, projects, skills, etc.)

2. **Feature Engineering:**
   - Extract features from resumes using NLP
   - Create numerical representations

3. **Train Model:**
   ```python
   from sklearn.ensemble import RandomForestClassifier
   import joblib
   
   # Train your model
   model = RandomForestClassifier()
   model.fit(X_train, y_train)
   
   # Save model
   joblib.dump(model, 'models/placement_model.pkl')
   ```

4. **Create SHAP Explainer:**
   ```python
   import shap
   
   explainer = shap.TreeExplainer(model)
   joblib.dump(explainer, 'models/shap_explainer.pkl')
   ```

5. **Update app.py to load actual models**

## 🌐 Deployment

### Frontend (Firebase Hosting)
```bash
cd frontend
npm run build
firebase deploy
```

### Backend (Google Cloud Run)
```bash
cd predictor_api
gcloud run deploy placement-predictor-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🎨 Customization

### Adding a Background Video
1. Place your video file in `frontend/public/`
2. Name it `3d-background-video.mp4` or update the path in `BackgroundVideo.jsx`

### Changing Theme Colors
Edit the theme in `frontend/src/App.jsx`:
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change this
    },
  },
});
```

## 🔒 Security Considerations

1. **Never commit `.env` files** with real credentials
2. **Set up Firestore security rules** to protect user data
3. **Implement rate limiting** on API endpoints
4. **Use environment variables** for all sensitive data
5. **Enable CORS** only for your frontend domain in production

## 📝 API Endpoints

### Flask API

- `GET /` - Health check
- `POST /predict` - Analyze resume and predict placement
  - Body: `multipart/form-data` with `resume` field (PDF file)
  - Response: JSON with probability, recommendations, SHAP values

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- sujal s kumar
- shraddha s poojary
- Shashank s
- anusha naik

## 🙏 Acknowledgments

- Google Gemini AI for conversational AI
- Firebase for backend services
- Material-UI for beautiful components
- Plotly for interactive charts
- SHAP for model explainability

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: your- sujaludupi@gmail.com.com

## 🎯 Future Enhancements

- [ ] Real-time interview feedback
- [ ] Company-specific interview preparation
- [ ] Resume builder with AI suggestions
- [ ] Peer comparison analytics
- [ ] Mobile app version
- [ ] Integration with LinkedIn
- [ ] Advanced NLP for resume parsing
- [ ] Multi-language support

---

**Made with ❤️ for students and placement officers**
