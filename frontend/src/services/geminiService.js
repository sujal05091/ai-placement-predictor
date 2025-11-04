// Google Gemini AI Service
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Run a chat conversation with Gemini AI
 * @param {Array} history - Array of previous messages [{role: 'user'|'model', parts: [{text: 'message'}]}]
 * @param {string} newMessage - New message from user
 * @returns {Promise<string>} AI response text
 */
export const runChat = async (history = [], newMessage) => {
  try {
    // Check if this is a JSON generation request
    const isJsonRequest = newMessage.includes('JSON') || newMessage.includes('json') || 
                          newMessage.includes('Generate') || newMessage.includes('Create');
    
    console.log('🎯 JSON Request detected:', isJsonRequest);
    
    // Get the generative model - Using gemini-2.5-flash (current stable model)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',  // Current stable model for v1beta API
    });
    
    // For JSON requests, use direct generation with JSON mode hint
    if (isJsonRequest && history.length === 0) {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: newMessage }] }],
        generationConfig: {
          temperature: 0.1,  // Very low for predictable JSON
          maxOutputTokens: 3000,
        },
      });
      
      const response = result.response;
      const text = response.text();
      console.log('🤖 Gemini JSON Response (first 300 chars):', text.substring(0, 300));
      return text;
    }
    
    // For regular chat, use chat session
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 3000,
        temperature: 0.7,
      },
    });
    
    // Send the new message
    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    const text = response.text();
    
    console.log('🤖 Gemini Chat Response (first 200 chars):', text.substring(0, 200));
    
    return text;
  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    console.error('Error details:', error.message);
    throw error;
  }
};

/**
 * Run a mock interview session with Gemini AI
 * @param {Array} history - Chat history
 * @param {string} newMessage - User's message (or system instruction for first call)
 * @param {string} customInstruction - Optional custom system instruction
 * @returns {Promise<string>} AI interviewer response
 */
export const runMockInterview = async (history = [], newMessage, customInstruction = null) => {
  try {
    const systemInstruction = customInstruction || `You are an experienced technical interviewer conducting a mock interview for placement preparation. 
Your role is to:
- Ask relevant technical and behavioral questions
- Provide constructive feedback on answers
- Guide the candidate with hints if they struggle
- Maintain a professional yet supportive tone
- Cover topics like data structures, algorithms, system design, and soft skills
- Be encouraging and help candidates improve

Provide thoughtful, detailed responses to help candidates improve their interview skills.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',  // Current stable model for v1beta API
      systemInstruction: systemInstruction
    });
    
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
    });
    
    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    const text = response.text();
    
    // Handle empty responses (safety filters)
    if (!text || text.trim() === '') {
      return "I understand you're looking for career guidance. Let me help you with that! Could you please rephrase your question or be more specific about what aspect you'd like to focus on? For example:\n\n• Technical interview preparation\n• Resume building\n• Salary negotiation strategies\n• Skills to develop\n• Career path guidance\n\nWhat would you like to discuss?";
    }
    
    return text;
  } catch (error) {
    console.error('Error in mock interview:', error);
    throw error;
  }
};

/**
 * Get career guidance from Gemini AI
 * @param {string} query - User's career question
 * @returns {Promise<string>} AI response with career advice
 */
export const getCareerGuidance = async (query) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',  // Current stable model for v1beta API
      systemInstruction: `You are an expert career counselor specializing in tech placements and career development. 
Your expertise includes:
- Resume and CV optimization
- Interview preparation (technical and behavioral)
- Salary negotiation strategies
- Career path guidance
- Skills development roadmap
- Industry trends and insights

Provide helpful, actionable, and personalized guidance. Be encouraging and supportive while being realistic about challenges. Include specific examples and practical steps when relevant.`
    });
    
    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();
    
    // Handle empty responses (safety filters)
    if (!text || text.trim() === '') {
      return "I'm here to help with your career guidance! Could you please rephrase your question? I can assist with:\n\n📋 Resume and CV tips\n💼 Interview preparation\n💡 Skills development\n💰 Salary negotiation\n🎯 Career planning\n\nWhat would you like to know more about?";
    }
    
    return text;
  } catch (error) {
    console.error('Error getting career guidance:', error);
    throw error;
  }
};
