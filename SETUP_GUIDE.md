# 🚀 Quick Setup Guide - AI Placement Predictor

## Step 1: Install Frontend Dependencies

```powershell
cd "d:\project by sujal\ai placemet server\frontend"
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```powershell
cd "d:\project by sujal\ai placemet server\frontend"
Copy-Item .env.example .env
```

Edit `.env` and add your credentials:
- Firebase configuration (from Firebase Console)
- Google Gemini API key (from Google AI Studio)
- Power BI embed URL (from Power BI Service)

## Step 3: Set Up Python Backend

```powershell
cd "d:\project by sujal\ai placemet server\predictor_api"
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

## Step 4: Run the Application

### Terminal 1 - Backend API:
```powershell
cd "d:\project by sujal\ai placemet server\predictor_api"
.\venv\Scripts\activate
python app.py
```
API will run on: http://localhost:8080

### Terminal 2 - Frontend:
```powershell
cd "d:\project by sujal\ai placemet server\frontend"
npm run dev
```
Frontend will run on: http://localhost:3000

## Step 5: Access the Application

Open your browser and navigate to: http://localhost:3000

### Test Accounts
Create accounts using:
- Google Sign-In
- Email/Password Sign-Up

### Test the Features
1. **Predictor**: Upload a sample PDF resume
2. **AI Coach**: Click "AI Coach" in navbar for mock interviews
3. **Chatbot**: Click the floating chat button for career guidance
4. **TPO Dashboard**: Change user role to 'tpo' in Firestore to access

## 🔧 Troubleshooting

### Frontend Issues
- **Module not found**: Run `npm install` again
- **Port 3000 in use**: Change port in `vite.config.js`

### Backend Issues
- **Python version**: Ensure Python 3.11+ is installed
- **Port 8080 in use**: Change port in `app.py`
- **PyPDF2 errors**: Make sure PDF is valid and not corrupted

### Firebase Issues
- **Auth errors**: Check Firebase configuration in `.env`
- **Firestore errors**: Enable Firestore in Firebase Console

### API Issues
- **CORS errors**: Check Flask-CORS configuration
- **Connection refused**: Make sure backend is running

## 📦 What's Included

### ✅ Frontend (React + Vite)
- Authentication (Login/Signup with Firebase)
- Student Dashboard with resume upload
- AI Mock Interview with voice features
- Floating AI chatbot
- TPO Analytics dashboard
- Responsive Material-UI design

### ✅ Backend (Flask API)
- Resume PDF parsing
- Mock placement prediction
- SHAP explainability
- Feature extraction
- RESTful API endpoints
- Docker support

### ✅ Features
- Firebase Authentication (Email + Google)
- Firestore Database integration
- Google Gemini AI integration
- Speech recognition & synthesis
- Interactive charts (Plotly)
- Power BI embedding
- Protected routes

## 🎯 Next Steps

1. **Add Background Video**: Place `3d-background-video.mp4` in `frontend/public/`
2. **Train ML Model**: Replace mock model with trained model
3. **Configure Firebase**: Set up Firestore security rules
4. **Get API Keys**: Obtain Gemini API key and Firebase credentials
5. **Customize Theme**: Modify colors in `App.jsx`
6. **Deploy**: Use Firebase Hosting + Google Cloud Run

## 📚 Documentation

- Full documentation: See `README.md`
- API documentation: Check `/` endpoint of Flask API
- Component props: See inline comments in code

## 🆘 Need Help?

Check these resources:
- Firebase Docs: https://firebase.google.com/docs
- React Router: https://reactrouter.com/
- Material-UI: https://mui.com/
- Plotly: https://plotly.com/javascript/
- Flask: https://flask.palletsprojects.com/

---

**Happy Coding! 🎉**
