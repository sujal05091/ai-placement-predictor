# 🚀 Real-Time Data Simulation - Deployment Guide

## Overview
This feature allows you to add mock student data from Google Sheets directly to Firestore, which instantly updates your TPO Dashboard with real-time analytics.

---

## 📋 Prerequisites

- Google Cloud Platform account (free tier works)
- Google Cloud CLI installed (optional, but recommended)
- Firebase project already set up
- Google Account for Sheets

---

## 🔧 Part 1: Deploy Google Cloud Function

### Option A: Deploy via Google Cloud Console (Easiest)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your Firebase project: `ai-placement-predictor`

2. **Navigate to Cloud Functions**
   - In the left menu: Products → Cloud Functions
   - Click "CREATE FUNCTION"

3. **Configure Function**
   ```
   Environment: 2nd gen
   Function name: addMockReport
   Region: us-central1 (or closest to you)
   ```

4. **Trigger Configuration**
   ```
   Trigger type: HTTPS
   Authentication: Allow unauthenticated invocations ✅
   (This is needed for Google Sheets to call it)
   ```

5. **Runtime Settings**
   ```
   Memory: 256 MB
   Timeout: 60 seconds
   Runtime: Node.js 18
   ```

6. **Upload Code**
   - Click "NEXT" to go to code editor
   - **Inline Editor** tab should be selected
   - Entry point: `addMockReport`
   
   - **Copy contents of `package.json`** → Paste in left file
   - **Copy contents of `index.js`** → Paste in right file

7. **Update Project ID**
   - In `index.js`, line 16, replace:
   ```javascript
   projectId: 'ai-placement-predictor', // Replace with your Firebase project ID
   ```
   - With your actual project ID

8. **Deploy**
   - Click "DEPLOY" button
   - Wait 2-3 minutes for deployment
   - Copy the **Trigger URL** (looks like: `https://us-central1-xxx.cloudfunctions.net/addMockReport`)

### Option B: Deploy via gcloud CLI (Advanced)

```bash
# Navigate to cloud-function directory
cd "d:\project by sujal\ai placemet server\cloud-function"

# Deploy function
gcloud functions deploy addMockReport \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1 \
  --entry-point addMockReport
```

---

## 📊 Part 2: Setup Google Sheet

### Step 1: Create New Google Sheet

1. Go to: https://sheets.google.com/
2. Create a new blank spreadsheet
3. Name it: "AI Placement - Student Data Sync"

### Step 2: Add Column Headers (Row 1)

| Column A | Column B | Column C | Column D | Column E |
|----------|----------|----------|----------|----------|
| CGPA     | Internships | Skills | Department | Status |

### Step 3: Add Sample Data (Optional)

| CGPA | Internships | Skills | Department | Status |
|------|-------------|--------|------------|--------|
| 8.5  | 2           | Python, SQL, React | Computer Science | |
| 7.8  | 1           | JavaScript, Node.js | Information Technology | |
| 9.2  | 3           | Java, Spring Boot, AWS | Software Engineering | |

---

## 📝 Part 3: Install Apps Script

### Step 1: Open Script Editor

1. In your Google Sheet, go to: **Extensions** → **Apps Script**
2. Delete any default code in `Code.gs`

### Step 2: Paste Code

1. **Copy the entire contents** of `Code.gs` file
2. **Paste** into the Apps Script editor

### Step 3: Update Cloud Function URL

1. Find line 17 in the code:
   ```javascript
   const CLOUD_FUNCTION_URL = 'https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/addMockReport';
   ```

2. Replace with your actual Cloud Function URL from Part 1, Step 8

3. Example:
   ```javascript
   const CLOUD_FUNCTION_URL = 'https://us-central1-ai-placement-predictor.cloudfunctions.net/addMockReport';
   ```

### Step 4: Save and Deploy

1. Click the **💾 Save** icon (or Ctrl+S)
2. Name your project: "AI Placement Sync"
3. Close the Apps Script tab

### Step 5: Refresh Google Sheet

1. Go back to your Google Sheet
2. Refresh the page (F5 or Ctrl+R)
3. You should see a new menu: **Admin Tools**

---

## 🧪 Part 4: Testing

### Test 1: Connection Test

1. In your Google Sheet: **Admin Tools** → **View Instructions**
2. Read the instructions
3. In Apps Script editor, run function: `testConnection()`
4. Should show "✅ Connection Test Successful"

### Test 2: Send Single Row

1. Fill in data in row 2:
   ```
   CGPA: 8.5
   Internships: 2
   Skills: Python, SQL, React
   Department: Computer Science
   ```

2. Click on any cell in row 2

3. Go to: **Admin Tools** → **Send Row to Firebase**

4. Confirm the dialog

5. Wait for success message

6. Column E (Status) should change to "SENT"

### Test 3: View in TPO Dashboard

1. Go to your app: `localhost:3001/tpo-analytics`

2. Login as TPO user

3. You should see:
   - Total Analyses increased by 1
   - New row in the table
   - Updated charts

---

## 🎯 Usage Workflow

### Daily Operation:

1. **Add New Row** in Google Sheet
   ```
   Row 3: 7.5 | 1 | JavaScript, HTML, CSS | Web Development |
   ```

2. **Select the Row** (click any cell in that row)

3. **Click**: Admin Tools → Send Row to Firebase

4. **Confirm** the dialog

5. **Wait** for "✅ Data sent successfully!" toast

6. **Check TPO Dashboard** - Data appears instantly!

### Batch Operation:

1. Fill multiple rows with data

2. **Select all rows** you want to send (click and drag)

3. **Click**: Admin Tools → Send Multiple Rows

4. Confirm batch send

5. Wait for completion summary

---

## 🔍 Troubleshooting

### Issue: "Cloud Function URL not found"

**Solution:**
- Make sure you updated `CLOUD_FUNCTION_URL` in Code.gs
- Verify the URL is correct (copy from Cloud Console)
- Check that function is deployed successfully

### Issue: "Permission denied"

**Solution:**
- Make sure Cloud Function allows unauthenticated invocations
- In Cloud Console → Cloud Functions → Select function → Permissions tab
- Add `allUsers` with role `Cloud Functions Invoker`

### Issue: "CORS error"

**Solution:**
- The code already handles CORS
- Make sure you deployed the latest `index.js` code
- Check Cloud Function logs for errors

### Issue: "No data appears in dashboard"

**Solution:**
- Verify Firestore project ID is correct in `index.js`
- Check Firestore console to see if data was written
- Refresh TPO Dashboard page
- Check browser console for errors

### Issue: "Status column doesn't update"

**Solution:**
- Apps Script needs permission to modify the sheet
- First run: Google will ask for permissions - click "Allow"
- If still fails, check Apps Script execution log

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  Google Sheet   │
│  (Add row data) │
└────────┬────────┘
         │
         │ Admin Tools → Send Row
         ↓
┌─────────────────────────┐
│  Apps Script (Code.gs)  │
│  • Reads row data       │
│  • Validates input      │
│  • Creates JSON payload │
└────────┬────────────────┘
         │
         │ HTTP POST
         ↓
┌──────────────────────────────┐
│  Cloud Function (index.js)   │
│  • Receives data             │
│  • Calculates probability    │
│  • Generates recommendations │
└────────┬─────────────────────┘
         │
         │ Firestore Write
         ↓
┌────────────────────────┐
│  Firestore Database    │
│  users/{uid}/reports   │
└────────┬───────────────┘
         │
         │ Real-time Read
         ↓
┌────────────────────────┐
│   TPO Dashboard        │
│   • Charts update      │
│   • Table updates      │
│   • Stats recalculate  │
└────────────────────────┘
```

---

## 💡 Advanced Features

### Custom User ID

Edit `Code.gs` line 19-21:
```javascript
const DEFAULT_USER_ID = 'your_custom_user_id';
const DEFAULT_USER_NAME = 'Your Student Name';
const DEFAULT_USER_EMAIL = 'student@university.edu';
```

### Different Probability Algorithm

Edit `index.js` `calculateMockProbability()` function to adjust scoring logic.

### Additional Fields

Add more columns to Sheet and update both:
- `Code.gs`: Read additional columns
- `index.js`: Process additional fields

---

## 🎉 Success Indicators

✅ Cloud Function deployed successfully
✅ Apps Script installed and saved
✅ "Admin Tools" menu appears in Sheet
✅ Test connection succeeds
✅ Single row sends successfully
✅ Status column updates to "SENT"
✅ Data appears in TPO Dashboard
✅ Charts and stats update correctly

---

## 📞 Need Help?

- Check Cloud Function logs in Google Cloud Console
- Check Apps Script execution logs
- Review Firestore Database console
- Check browser console for frontend errors

---

**Your real-time data simulation is now ready! Add data to Google Sheets and watch it appear instantly in your TPO Dashboard! 🚀**
