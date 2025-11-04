# 🚨 URGENT: Firestore Rules Fix

## Problem
Firestore is returning **400 errors** and going offline because the security rules haven't been deployed or are too restrictive.

Error: `Failed to get document because the client is offline`

## Quick Fix (2 minutes)

### Option 1: Update Rules in Firebase Console (FASTEST)

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `ai-placement-predictor`
3. **Click "Firestore Database"** in left menu
4. **Click the "Rules" tab** at the top
5. **Replace ALL the rules** with this:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Temporary: Allow all authenticated users to read/write (for development)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. **Click "Publish"** button
7. **Wait 10-30 seconds** for rules to propagate
8. **Refresh your browser** (http://localhost:3002)

### Option 2: Use Firebase CLI

```powershell
cd "d:\project by sujal\ai placemet server\frontend"
firebase init firestore
# Select "Use an existing project"
# Select "ai-placement-predictor"
# Press Enter to accept firestore.rules
# Press Enter to skip firestore.indexes.json
firebase deploy --only firestore:rules
```

## What I Already Fixed

✅ **Added error handling** in `ProtectedRoute.jsx`:
- If Firestore fails to load profile, app continues with default profile
- User can now access the dashboard even if Firestore is offline
- Console logs show detailed error information

✅ **Updated firestore.rules** file locally with proper rules

## Current Status

The app will now **work even with Firestore offline**, but you should still fix the rules for full functionality:
- ✅ Authentication works
- ✅ Dashboard loads
- ⚠️ Profile data may not persist (uses default profile)
- ⚠️ Resume analysis results won't save to Firestore

## Test After Fixing Rules

1. Refresh browser at http://localhost:3002
2. Check console - should see:
   ```
   🔒 ProtectedRoute: User profile loaded { email: "...", role: "student" }
   ```
3. No more "400 Bad Request" errors
4. No more "client is offline" errors

## Production Rules (Use Later)

For production, use these more secure rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // All authenticated users can read user profiles (for TPO dashboard)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
    
    // Analysis results - users can only access their own
    match /analyses/{analysisId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // TPO users can read all analyses
    match /analyses/{analysisId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'tpo';
    }
  }
}
```

---

**Action Required**: Update Firestore rules in Firebase Console (Option 1 above) - takes 2 minutes!
