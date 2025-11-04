# 🎯 Quick Reference - Google Sheets to Firestore Sync

## File Structure
```
📁 ai placemet server/
├── 📁 cloud-function/
│   ├── package.json     ← Cloud Function dependencies
│   └── index.js         ← Main Cloud Function code
├── 📁 google-sheets-script/
│   └── Code.gs          ← Google Apps Script code
└── DEPLOYMENT_GUIDE.md  ← Full deployment instructions
```

## Quick Deploy Checklist

### ☁️ Cloud Function (5 mins)
- [ ] Go to Google Cloud Console
- [ ] Create new Cloud Function named `addMockReport`
- [ ] Set trigger to HTTPS (unauthenticated)
- [ ] Runtime: Node.js 18
- [ ] Copy `package.json` and `index.js`
- [ ] Update project ID in line 16 of `index.js`
- [ ] Deploy and copy Trigger URL

### 📊 Google Sheet (3 mins)
- [ ] Create new Google Sheet
- [ ] Add headers: CGPA | Internships | Skills | Department | Status
- [ ] Go to Extensions → Apps Script
- [ ] Copy `Code.gs` code
- [ ] Update `CLOUD_FUNCTION_URL` on line 17
- [ ] Save and refresh sheet

### ✅ Test (2 mins)
- [ ] Add sample data in row 2
- [ ] Select row 2
- [ ] Admin Tools → Send Row to Firebase
- [ ] Check TPO Dashboard

## Google Sheet Format

| Column | Name | Type | Example |
|--------|------|------|---------|
| A | CGPA | Number | 8.5 |
| B | Internships | Integer | 2 |
| C | Skills | Text | Python, SQL, React |
| D | Department | Text | Computer Science |
| E | Status | Auto | SENT (auto-filled) |

## Cloud Function URL Format
```
https://[REGION]-[PROJECT_ID].cloudfunctions.net/addMockReport
```

Example:
```
https://us-central1-ai-placement-predictor.cloudfunctions.net/addMockReport
```

## Apps Script Variables to Update

```javascript
// Line 17: Cloud Function URL
const CLOUD_FUNCTION_URL = 'YOUR_URL_HERE';

// Lines 19-21: Optional customization
const DEFAULT_USER_ID = 'mock_user_sheets_sync';
const DEFAULT_USER_NAME = 'Test Student';
const DEFAULT_USER_EMAIL = 'test.student@example.com';
```

## Common Commands

### In Google Sheet:
- **View Instructions**: Admin Tools → View Instructions
- **Send Single Row**: Select row → Admin Tools → Send Row to Firebase
- **Send Multiple**: Select rows → Admin Tools → Send Multiple Rows

### In Apps Script Editor:
- **Test Connection**: Run → testConnection
- **View Logs**: View → Logs (Ctrl+Enter)

## API Payload Structure

```json
{
  "cgpa": 8.5,
  "internships": 2,
  "skills": "Python, SQL, React",
  "department": "Computer Science",
  "userId": "mock_user_sheets_sync",
  "userName": "Test Student",
  "userEmail": "test.student@example.com"
}
```

## Success Response

```json
{
  "success": true,
  "message": "Mock report added successfully",
  "data": {
    "reportId": "abc123...",
    "userId": "mock_user_sheets_sync",
    "probability": 85.5,
    "recommendedTrack": "Software Engineer"
  }
}
```

## Firestore Data Structure

```
users/
  └── mock_user_sheets_sync/
      ├── email: "test.student@example.com"
      ├── displayName: "Test Student"
      ├── role: "student"
      └── reports/ (subcollection)
          └── [auto-id]/
              ├── cgpa: 8.5
              ├── internships: 2
              ├── skills: ["Python", "SQL", "React"]
              ├── probability: 85.5
              ├── recommended_track: "Software Engineer"
              ├── recommendations: [...]
              └── timestamp: Date
```

## Troubleshooting Quick Fixes

| Error | Quick Fix |
|-------|-----------|
| URL not found | Update CLOUD_FUNCTION_URL |
| Permission denied | Allow unauthenticated in Cloud Function |
| CORS error | Redeploy latest index.js code |
| No menu | Refresh sheet, check Apps Script saved |
| Status not updating | Allow Apps Script permissions |

## Performance Notes

- Single row: ~1-2 seconds
- Batch (10 rows): ~10-15 seconds
- TPO Dashboard updates: Instant (refresh page)

## Cost Estimate (Google Cloud Free Tier)

- Cloud Functions: 2M invocations/month FREE
- Firestore: 50K reads + 20K writes/day FREE
- This feature: **Completely FREE** for typical usage

---

**Ready to use! Follow DEPLOYMENT_GUIDE.md for detailed instructions.**
