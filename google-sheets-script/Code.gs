/**
 * Google Apps Script for AI Placement Predictor
 * 
 * This script adds a custom menu to Google Sheets that allows
 * administrators to send student data rows to Firestore via a
 * Google Cloud Function.
 * 
 * Instructions:
 * 1. Create a Google Sheet with columns: CGPA, Internships, Skills, Department, Status
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code
 * 4. Update the CLOUD_FUNCTION_URL with your deployed function URL
 * 5. Save and refresh the sheet
 * 6. Use "Admin Tools" → "Send Row to Firebase" from the menu
 */

// ⚠️ IMPORTANT: Replace this with your actual Google Cloud Function URL after deployment
const CLOUD_FUNCTION_URL = 'https://YOUR-REGION-YOUR-PROJECT-ID.cloudfunctions.net/addMockReport';

// Optional: Configure a default user ID for all mock data
const DEFAULT_USER_ID = 'mock_user_sheets_sync';
const DEFAULT_USER_NAME = 'Test Student';
const DEFAULT_USER_EMAIL = 'test.student@example.com';

/**
 * Creates a custom menu when the spreadsheet is opened
 * This adds "Admin Tools" menu with sync options
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Admin Tools')
    .addItem('Send Row to Firebase', 'sendCurrentRow')
    .addSeparator()
    .addItem('Send Multiple Rows', 'sendMultipleRows')
    .addSeparator()
    .addItem('View Instructions', 'showInstructions')
    .addToUi();
  
  Logger.log('Admin Tools menu created successfully');
}

/**
 * Shows instructions in a dialog box
 */
function showInstructions() {
  const ui = SpreadsheetApp.getUi();
  
  const instructions = 
    'HOW TO USE:\n\n' +
    '1. Fill in student data in columns A-D:\n' +
    '   • Column A: CGPA (e.g., 7.8)\n' +
    '   • Column B: Internships (e.g., 2)\n' +
    '   • Column C: Skills (e.g., "Python, SQL, React")\n' +
    '   • Column D: Department (e.g., "Computer Science")\n\n' +
    '2. Select the row you want to send\n\n' +
    '3. Go to Admin Tools → Send Row to Firebase\n\n' +
    '4. Column E (Status) will update to "SENT" on success\n\n' +
    'The data will immediately appear in your TPO Dashboard!';
  
  ui.alert('AI Placement Predictor - Instructions', instructions, ui.ButtonSet.OK);
}

/**
 * Validates that a row has all required data
 * @param {Array} rowData - Array of cell values from the row
 * @returns {Object} Validation result with isValid flag and error message
 */
function validateRowData(rowData) {
  // Check if row has data
  if (!rowData || rowData.length < 4) {
    return {
      isValid: false,
      error: 'Row must have at least 4 columns: CGPA, Internships, Skills, Department'
    };
  }
  
  const [cgpa, internships, skills, department] = rowData;
  
  // Validate CGPA
  if (!cgpa || isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
    return {
      isValid: false,
      error: 'CGPA must be a number between 0 and 10'
    };
  }
  
  // Validate Internships
  if (internships === '' || isNaN(internships) || internships < 0) {
    return {
      isValid: false,
      error: 'Internships must be a non-negative number'
    };
  }
  
  // Validate Skills
  if (!skills || skills.toString().trim() === '') {
    return {
      isValid: false,
      error: 'Skills cannot be empty'
    };
  }
  
  // Validate Department
  if (!department || department.toString().trim() === '') {
    return {
      isValid: false,
      error: 'Department cannot be empty'
    };
  }
  
  return { isValid: true };
}

/**
 * Main function to send the currently selected row to Firebase
 * Reads data from columns A-D and sends to Cloud Function
 */
function sendCurrentRow() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const activeRange = sheet.getActiveRange();
  const row = activeRange.getRow();
  
  // Check if a valid row is selected (not header row)
  if (row <= 1) {
    ui.alert('Error', 'Please select a data row (not the header row) and try again.', ui.ButtonSet.OK);
    return;
  }
  
  try {
    // Get data from columns A through D (CGPA, Internships, Skills, Department)
    const range = sheet.getRange(row, 1, 1, 4);
    const rowData = range.getValues()[0];
    
    // Validate row data
    const validation = validateRowData(rowData);
    if (!validation.isValid) {
      ui.alert('Validation Error', validation.error, ui.ButtonSet.OK);
      return;
    }
    
    // Extract values
    const [cgpa, internships, skills, department] = rowData;
    
    // Show confirmation dialog
    const confirmation = ui.alert(
      'Confirm Send',
      `Send this data to Firebase?\n\n` +
      `CGPA: ${cgpa}\n` +
      `Internships: ${internships}\n` +
      `Skills: ${skills}\n` +
      `Department: ${department}`,
      ui.ButtonSet.YES_NO
    );
    
    if (confirmation !== ui.Button.YES) {
      return;
    }
    
    // Create payload object
    const payload = {
      cgpa: parseFloat(cgpa),
      internships: parseInt(internships),
      skills: skills.toString(),
      department: department.toString(),
      userId: DEFAULT_USER_ID,
      userName: DEFAULT_USER_NAME,
      userEmail: DEFAULT_USER_EMAIL
    };
    
    // Configure HTTP request options
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true // Don't throw exceptions on HTTP errors
    };
    
    // Send POST request to Cloud Function
    Logger.log('Sending data to Cloud Function: ' + CLOUD_FUNCTION_URL);
    Logger.log('Payload: ' + JSON.stringify(payload));
    
    const response = UrlFetchApp.fetch(CLOUD_FUNCTION_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('Response Code: ' + responseCode);
    Logger.log('Response Body: ' + responseText);
    
    // Handle response
    if (responseCode === 200) {
      // Parse response
      const responseData = JSON.parse(responseText);
      
      // Update Status column (E) to "SENT"
      sheet.getRange(row, 5).setValue('SENT');
      
      // Show success notification
      SpreadsheetApp.getActiveSpreadsheet().toast(
        `✅ Data sent successfully!\n` +
        `Probability: ${responseData.data.probability}%\n` +
        `Track: ${responseData.data.recommendedTrack}`,
        'Success',
        5
      );
      
      ui.alert(
        'Success!',
        `Data sent to Firebase successfully!\n\n` +
        `Report ID: ${responseData.data.reportId}\n` +
        `Placement Probability: ${responseData.data.probability}%\n` +
        `Recommended Track: ${responseData.data.recommendedTrack}\n\n` +
        `Check your TPO Dashboard to see the updated data!`,
        ui.ButtonSet.OK
      );
      
    } else {
      // Handle error response
      let errorMessage = 'Unknown error';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || responseText;
      } catch (e) {
        errorMessage = responseText;
      }
      
      Logger.log('Error: ' + errorMessage);
      
      ui.alert(
        'Error',
        `Failed to send data to Firebase.\n\n` +
        `Error: ${errorMessage}\n` +
        `Status Code: ${responseCode}\n\n` +
        `Please check the Cloud Function URL and try again.`,
        ui.ButtonSet.OK
      );
    }
    
  } catch (error) {
    Logger.log('Exception: ' + error.message);
    ui.alert(
      'Error',
      `An error occurred:\n${error.message}\n\n` +
      `Please check:\n` +
      `1. Cloud Function URL is correct\n` +
      `2. Cloud Function is deployed\n` +
      `3. Row has valid data`,
      ui.ButtonSet.OK
    );
  }
}

/**
 * Advanced function to send multiple selected rows to Firebase
 * Processes rows in batch for efficiency
 */
function sendMultipleRows() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selection = sheet.getActiveRange();
  const startRow = selection.getRow();
  const numRows = selection.getNumRows();
  
  // Check if header row is selected
  if (startRow <= 1) {
    ui.alert('Error', 'Please select data rows (not the header row) and try again.', ui.ButtonSet.OK);
    return;
  }
  
  // Confirm batch send
  const confirmation = ui.alert(
    'Confirm Batch Send',
    `Send ${numRows} row(s) to Firebase?`,
    ui.ButtonSet.YES_NO
  );
  
  if (confirmation !== ui.Button.YES) {
    return;
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  // Process each row
  for (let i = 0; i < numRows; i++) {
    const currentRow = startRow + i;
    
    try {
      // Get row data
      const range = sheet.getRange(currentRow, 1, 1, 4);
      const rowData = range.getValues()[0];
      
      // Validate
      const validation = validateRowData(rowData);
      if (!validation.isValid) {
        Logger.log(`Row ${currentRow} validation failed: ${validation.error}`);
        errorCount++;
        continue;
      }
      
      // Extract and send
      const [cgpa, internships, skills, department] = rowData;
      
      const payload = {
        cgpa: parseFloat(cgpa),
        internships: parseInt(internships),
        skills: skills.toString(),
        department: department.toString(),
        userId: `${DEFAULT_USER_ID}_${currentRow}`,
        userName: `${DEFAULT_USER_NAME} ${currentRow}`,
        userEmail: DEFAULT_USER_EMAIL
      };
      
      const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };
      
      const response = UrlFetchApp.fetch(CLOUD_FUNCTION_URL, options);
      
      if (response.getResponseCode() === 200) {
        sheet.getRange(currentRow, 5).setValue('SENT');
        successCount++;
      } else {
        errorCount++;
      }
      
      // Add small delay to avoid rate limiting
      Utilities.sleep(500);
      
    } catch (error) {
      Logger.log(`Error processing row ${currentRow}: ${error.message}`);
      errorCount++;
    }
  }
  
  // Show summary
  ui.alert(
    'Batch Send Complete',
    `Results:\n` +
    `✅ Successfully sent: ${successCount}\n` +
    `❌ Failed: ${errorCount}\n\n` +
    `Check your TPO Dashboard to see the updated data!`,
    ui.ButtonSet.OK
  );
}

/**
 * Test function to verify Cloud Function connectivity
 * Run this from Apps Script editor to test the connection
 */
function testConnection() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const testPayload = {
      cgpa: 8.5,
      internships: 2,
      skills: 'Python, JavaScript, React',
      department: 'Computer Science',
      userId: 'test_user',
      userName: 'Test User',
      userEmail: 'test@example.com'
    };
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(testPayload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(CLOUD_FUNCTION_URL, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode === 200) {
      ui.alert('✅ Connection Test Successful', 'Cloud Function is working correctly!', ui.ButtonSet.OK);
    } else {
      ui.alert('⚠️ Connection Test Failed', `Status Code: ${responseCode}\n${response.getContentText()}`, ui.ButtonSet.OK);
    }
    
  } catch (error) {
    ui.alert('❌ Connection Test Error', error.message, ui.ButtonSet.OK);
  }
}
