/**
 * Google Cloud Function: Add Mock Student Report to Firestore
 * 
 * This function receives student data from Google Sheets and creates
 * a mock analysis report in Firestore for TPO Dashboard visualization.
 * 
 * Trigger Type: HTTP
 * Node.js Runtime: 18
 */

const { Firestore } = require('@google-cloud/firestore');
const cors = require('cors');

// Initialize Firestore with automatic credentials from Cloud Function environment
const firestore = new Firestore({
  projectId: 'ai-placement-predictor', // Replace with your Firebase project ID
});

// Configure CORS to allow requests from Google Apps Script
const corsHandler = cors({
  origin: true, // Allow all origins (Google Apps Script, testing tools, etc.)
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

/**
 * Simulates a placement probability based on student data
 * Uses simple heuristics to generate realistic probabilities
 */
function calculateMockProbability(cgpa, internships, skillsArray) {
  let probability = 40; // Base probability
  
  // CGPA contribution (max 30 points)
  if (cgpa >= 9.0) probability += 30;
  else if (cgpa >= 8.0) probability += 25;
  else if (cgpa >= 7.0) probability += 20;
  else if (cgpa >= 6.0) probability += 10;
  
  // Internships contribution (max 20 points)
  probability += Math.min(internships * 10, 20);
  
  // Skills contribution (max 10 points)
  probability += Math.min(skillsArray.length * 2, 10);
  
  // Ensure probability is between 0-100
  return Math.min(Math.max(probability, 0), 100);
}

/**
 * Generates mock recommendations based on student profile
 */
function generateRecommendations(cgpa, internships, skills, department) {
  const recommendations = [];
  
  if (cgpa < 7.0) {
    recommendations.push("Focus on improving academic performance to increase placement opportunities");
  }
  
  if (internships < 2) {
    recommendations.push("Gain more practical experience through internships in your field");
  }
  
  if (skills.toLowerCase().includes('python') || skills.toLowerCase().includes('java')) {
    recommendations.push("Strong programming foundation - consider advanced software development roles");
  } else {
    recommendations.push("Develop programming skills in Python, Java, or JavaScript for better opportunities");
  }
  
  if (department.toLowerCase().includes('computer') || department.toLowerCase().includes('cs')) {
    recommendations.push("Explore full-stack development, data science, or cloud computing specializations");
  }
  
  recommendations.push("Participate in coding competitions and open-source projects to build portfolio");
  
  return recommendations;
}

/**
 * Determines recommended career track based on student profile
 */
function getRecommendedTrack(cgpa, skills, department) {
  const skillsLower = skills.toLowerCase();
  
  if (skillsLower.includes('data') || skillsLower.includes('analytics') || skillsLower.includes('sql')) {
    return 'Data Analyst';
  }
  
  if (skillsLower.includes('python') && skillsLower.includes('machine learning')) {
    return 'Data Scientist';
  }
  
  if (skillsLower.includes('react') || skillsLower.includes('angular') || skillsLower.includes('vue')) {
    return 'Frontend Developer';
  }
  
  if (skillsLower.includes('node') || skillsLower.includes('backend')) {
    return 'Backend Developer';
  }
  
  if (cgpa >= 8.0 && (department.toLowerCase().includes('computer') || department.toLowerCase().includes('software'))) {
    return 'Software Engineer';
  }
  
  return 'Software Developer';
}

/**
 * Main Cloud Function Entry Point
 * HTTP-triggered function to add mock student report to Firestore
 */
exports.addMockReport = (req, res) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    // Send CORS headers for preflight requests
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  // Wrap main logic in CORS handler
  corsHandler(req, res, async () => {
    try {
      // Validate HTTP method
      if (req.method !== 'POST') {
        return res.status(405).json({
          success: false,
          error: 'Method not allowed. Use POST.'
        });
      }

      // Parse request body
      const { cgpa, internships, skills, department, userId, userName, userEmail } = req.body;

      // Validate required fields
      if (!cgpa || internships === undefined || !skills || !department) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: cgpa, internships, skills, department'
        });
      }

      // Parse skills string into array
      const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);

      // Generate mock analysis data
      const probability = calculateMockProbability(parseFloat(cgpa), parseInt(internships), skillsArray);
      const confidence = Math.min(probability + Math.floor(Math.random() * 10), 100);
      const recommendedTrack = getRecommendedTrack(parseFloat(cgpa), skills, department);
      const recommendations = generateRecommendations(parseFloat(cgpa), parseInt(internships), skills, department);

      // Create mock report object
      const mockReport = {
        // Original data from Google Sheets
        cgpa: parseFloat(cgpa),
        internships: parseInt(internships),
        skills: skillsArray,
        department: department,
        
        // Generated analysis data
        probability: Math.round(probability * 10) / 10, // Round to 1 decimal
        confidence: confidence,
        recommended_track: recommendedTrack,
        recommendations: recommendations,
        
        // Mock SHAP values for feature importance visualization
        shap_values: {
          cgpa: Math.random() * 0.3,
          internships: Math.random() * 0.2,
          skills: Math.random() * 0.25,
          projects: Math.random() * 0.15,
          certifications: Math.random() * 0.1
        },
        
        // Metadata
        timestamp: new Date(),
        source: 'google_sheets_sync',
        userName: userName || 'Anonymous Student',
        userEmail: userEmail || 'student@example.com'
      };

      // Use provided userId or create a default test user
      const targetUserId = userId || 'mock_user_sheets_sync';

      // Check if user document exists, create if not
      const userRef = firestore.collection('users').doc(targetUserId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // Create user document for mock data
        await userRef.set({
          email: mockReport.userEmail,
          displayName: mockReport.userName,
          role: 'student',
          createdAt: new Date(),
          source: 'google_sheets_sync'
        });
        console.log(`Created new user document: ${targetUserId}`);
      }

      // Add report to user's reports subcollection
      const reportsRef = firestore.collection('users').doc(targetUserId).collection('reports');
      const reportDoc = await reportsRef.add(mockReport);

      console.log(`Successfully added mock report: ${reportDoc.id} for user: ${targetUserId}`);

      // Send success response
      return res.status(200).json({
        success: true,
        message: 'Mock report added successfully',
        data: {
          reportId: reportDoc.id,
          userId: targetUserId,
          probability: mockReport.probability,
          recommendedTrack: mockReport.recommended_track
        }
      });

    } catch (error) {
      console.error('Error adding mock report:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
      });
    }
  });
};
