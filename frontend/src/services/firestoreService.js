// Firestore Service
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Create a new user profile in Firestore
 * @param {string} userId - User ID
 * @param {Object} profileData - User profile data
 * @returns {Promise<void>}
 */
export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Check if user profile already exists
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user profile
      await setDoc(userRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('User profile created successfully');
    } else {
      console.log('User profile already exists');
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User profile data or null if not found
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.log('No user profile found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Update user profile in Firestore
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Save placement prediction results to user profile
 * @param {string} userId - User ID
 * @param {Object} predictionData - Prediction results
 * @returns {Promise<void>}
 */
export const savePredictionResults = async (userId, predictionData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      lastPrediction: {
        ...predictionData,
        timestamp: serverTimestamp()
      },
      updatedAt: serverTimestamp()
    });
    
    console.log('Prediction results saved successfully');
  } catch (error) {
    console.error('Error saving prediction results:', error);
    throw error;
  }
};

/**
 * Save student report to reports subcollection
 * @param {string} uid - User ID
 * @param {Object} reportData - Report data from Python API
 * @returns {Promise<void>}
 */
export const saveStudentReport = async (uid, reportData) => {
  try {
    const reportsRef = collection(db, 'users', uid, 'reports');
    
    // Add timestamp to the report data
    const reportWithTimestamp = {
      ...reportData,
      timestamp: new Date()
    };
    
    // Save as a new document in the reports subcollection
    await addDoc(reportsRef, reportWithTimestamp);
    
    console.log('Student report saved successfully');
  } catch (error) {
    console.error('Error saving student report:', error);
    throw error;
  }
};

/**
 * Get all student reports from reports subcollection
 * @param {string} uid - User ID
 * @returns {Promise<Array>} Array of all reports ordered by timestamp
 */
export const getStudentReports = async (uid) => {
  try {
    const reportsRef = collection(db, 'users', uid, 'reports');
    const q = query(reportsRef, orderBy('timestamp', 'asc'));
    
    const querySnapshot = await getDocs(q);
    const reports = [];
    
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Retrieved ${reports.length} reports for user ${uid}`);
    return reports;
  } catch (error) {
    console.error('Error getting student reports:', error);
    throw error;
  }
};

/**
 * Update latest student report with skill test results
 * @param {string} uid - User ID
 * @param {Object} updatedData - Updated prediction data (probability, shap_values, etc.)
 * @returns {Promise<void>}
 */
export const updateStudentReportAfterTest = async (uid, updatedData) => {
  try {
    // Get the latest report
    const reportsRef = collection(db, 'users', uid, 'reports');
    const q = query(reportsRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const latestReportDoc = querySnapshot.docs[0];
      const reportDocRef = doc(db, 'users', uid, 'reports', latestReportDoc.id);
      
      // Update the report with new values
      await updateDoc(reportDocRef, {
        probability: updatedData.probability,
        shap_values: updatedData.shap_values,
        confidence: updatedData.confidence,
        recommended_track: updatedData.track,
        lastUpdated: new Date(),
        skillTestsCompleted: updatedData.completedSkills || []
      });
      
      console.log('Student report updated after skill test');
    } else {
      console.warn('No reports found to update');
    }
  } catch (error) {
    console.error('Error updating student report:', error);
    throw error;
  }
};
