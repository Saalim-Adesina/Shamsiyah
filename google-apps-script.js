// Google Apps Script for handling Shamsiyah Waitlist Form
// To use this:
// 1. Go to https://script.google.com
// 2. Create a new project
// 3. Paste this entire script
// 4. Create a new Google Sheet called "Waitlist"
// 5. Deploy as Web App (Execute as: Me, Who has access: Anyone)
// 6. Copy the deployment URL and replace 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE' in script.js

const SHEET_ID = '0'; // Replace with your Sheet ID from the URL
const SHEET_NAME = 'Waitlist';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Add headers if they don't exist
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Use Case']);
    }
    
    // Append the new data
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.useCase
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Add this function to test locally
function testPost() {
  const testData = {
    timestamp: new Date().toLocaleString(),
    name: 'Test User',
    email: 'test@example.com',
    useCase: 'Residential House'
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  Logger.log(result);
}
