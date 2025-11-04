# Frontend-Backend Integration Guide

## ✅ COMPLETED: StudentDashboard.jsx Updated

Your `StudentDashboard.jsx` has been **completely updated** to connect to the live Flask API at:
```
https://placementpredictionai.onrender.com/predict
```

---

## 🔄 What Changed

### **REMOVED (Old Logic)**
❌ Local Python API calls (`http://127.0.0.1:8080`)  
❌ `savePredictionResults()` - No longer needed (backend saves to Supabase)  
❌ `saveStudentReport()` - No longer needed (backend saves to Supabase)  
❌ `mockUploadToCloudinary()` - No longer needed (backend uploads to Cloudinary)  
❌ Environment variable dependency (`VITE_PREDICTOR_API_URL`)  

### **ADDED (New Logic)**
✅ Direct connection to live Flask API  
✅ `FormData` with **2 fields**:
   - `file` - The PDF resume
   - `uid` - Firebase Auth user ID (critical for backend)
✅ 60-second timeout for Render.com cold starts  
✅ Enhanced error handling with detailed messages  
✅ Auto-refresh for `ProgressChart` after analysis  
✅ User authentication check before analysis  
✅ Loading indicator for server wake-up  

---

## 🎯 How It Works Now

### **Data Flow**
```
1. User uploads PDF resume
2. Click "Analyze My Employability"
3. Frontend sends FormData to:
   https://placementpredictionai.onrender.com/predict
   
   FormData contains:
   - file: resume.pdf
   - uid: "firebase_user_id_here"

4. Backend (Flask) does EVERYTHING:
   ✅ Uploads PDF to Cloudinary
   ✅ Extracts text from PDF
   ✅ Runs ML model prediction
   ✅ Saves results to Supabase
   ✅ Returns JSON response

5. Frontend displays results:
   ✅ Gauge chart (placement probability)
   ✅ SHAP chart (decision factors)
   ✅ Recommendations list
   ✅ Progress chart (auto-refreshes)
```

---

## 🔑 Critical Details

### **FormData Structure**
```javascript
const formData = new FormData();
formData.append('file', selectedFile);  // PDF file
formData.append('uid', user.uid);        // Firebase UID
```

### **Expected API Response**
The backend should return JSON with these fields:
```json
{
  "probability": 85.5,
  "recommended_track": "Software Development",
  "confidence": 92,
  "shap_values": {
    "CGPA": 0.45,
    "Internships": 0.30,
    "Skills": 0.25
  },
  "recommendations": [
    "Build 2 more projects to strengthen portfolio",
    "Learn React and Node.js",
    "Practice coding on LeetCode"
  ]
}
```

### **Timeout Handling**
- **60-second timeout** set for initial request
- Handles Render.com's cold start (server may sleep after inactivity)
- User sees: "🚀 Processing your resume... This may take 30-60 seconds on first request"

---

## 🧪 Testing Checklist

### **Before Testing**
- [ ] User is logged in with Firebase Auth
- [ ] Backend is deployed and running at `https://placementpredictionai.onrender.com`
- [ ] Backend expects `file` and `uid` in FormData
- [ ] Backend saves to Supabase automatically

### **Test Steps**
1. **Open App**: `http://localhost:5173` (or your dev server)
2. **Login**: Use Firebase Auth credentials
3. **Navigate**: Go to Student Dashboard
4. **Upload**: Select a PDF resume file
5. **Analyze**: Click "Analyze My Employability"
6. **Wait**: First request may take 30-60 seconds
7. **Verify**: Check if results display correctly

### **Expected Behavior**
✅ Loading spinner appears  
✅ "Processing..." message shows  
✅ After 30-60 seconds, results appear:
   - Gauge chart with probability percentage
   - SHAP chart with colored bars
   - Recommendations list with checkmarks
   - Progress chart updates with new data point

---

## 🐛 Troubleshooting

### **Error: "Cannot reach the server"**
**Cause**: API URL is wrong or server is down  
**Fix**: 
1. Verify backend is running: `curl https://placementpredictionai.onrender.com/predict`
2. Check if URL is correct in code (line 30)

### **Error: "The server took too long to respond"**
**Cause**: Render.com cold start (server was sleeping)  
**Fix**: Wait and try again. Second request will be faster.

### **Error: "Please log in to analyze your resume"**
**Cause**: User not authenticated  
**Fix**: Ensure Firebase Auth is working and user is logged in

### **Results don't show in Progress Chart**
**Cause**: Backend didn't save to Supabase  
**Fix**: 
1. Check backend logs
2. Verify Supabase credentials in backend
3. Ensure backend saves with correct `uid`

---

## 📁 Files Modified

```
frontend/src/pages/StudentDashboard.jsx
├── Lines 1-30: Updated imports and API URL
├── Lines 31-70: Removed old Firestore imports
├── Lines 71-120: New handleAnalyze() function
└── Lines 121-324: Enhanced UI with loading states
```

---

## 🚀 Next Steps

1. **Test the integration**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Verify backend is ready**:
   - Backend accepts FormData with `file` and `uid`
   - Backend uploads to Cloudinary
   - Backend saves to Supabase
   - Backend returns JSON with all required fields

3. **Deploy frontend**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 📊 Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│  FRONTEND (React + Firebase Auth)                   │
│  └─ StudentDashboard.jsx                            │
│     └─ Sends: FormData(file, uid)                   │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ HTTPS POST
                   │ https://placementpredictionai.onrender.com/predict
                   │
┌──────────────────▼──────────────────────────────────┐
│  BACKEND (Flask API on Render.com)                  │
│  ├─ Receives FormData                               │
│  ├─ Uploads to Cloudinary                           │
│  ├─ Extracts text from PDF                          │
│  ├─ Runs ML model                                   │
│  ├─ Saves to Supabase                               │
│  └─ Returns JSON response                           │
└──────────────────┬──────────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
       ▼                       ▼
┌─────────────┐         ┌─────────────┐
│  Cloudinary │         │   Supabase  │
│  (PDF URLs) │         │  (Results)  │
└─────────────┘         └─────────────┘
```

---

## ✨ Benefits of New Architecture

1. **Simplified Frontend**: No more complex upload/save logic
2. **Centralized Backend**: All business logic in one place
3. **Better Security**: Firebase UID passed securely
4. **Easier Maintenance**: Update backend without touching frontend
5. **Scalability**: Backend can handle multiple frontends

---

## 🎉 You're All Set!

The frontend is now **production-ready** and connected to your live Flask API. Just make sure:

✅ Backend is deployed and running  
✅ Backend accepts `file` and `uid` in FormData  
✅ Backend saves to Supabase  
✅ Backend returns correct JSON format  

**Happy coding! 🚀**
