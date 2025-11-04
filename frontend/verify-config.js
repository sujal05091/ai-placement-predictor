// Verify the exact service configuration
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDnyNFy6GwbB_TysaEWdCeeS3vcPUJnNNQ';
const genAI = new GoogleGenerativeAI(API_KEY);

async function verifyConfiguration() {
  console.log('🔍 Verifying Mock Interview Configuration\n');
  
  try {
    // Simulate exactly what the app does
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: `You are an experienced technical interviewer conducting a mock interview for placement preparation. 
Your role is to:
- Ask relevant technical and behavioral questions
- Provide constructive feedback on answers
- Guide the candidate with hints if they struggle
- Maintain a professional yet supportive tone
- Cover topics like data structures, algorithms, system design, and soft skills
- Be encouraging and help candidates improve

Provide thoughtful, detailed responses to help candidates prepare for real interviews.`
    });
    
    // Simulate the history format from MockInterviewPage (FIXED VERSION)
    // Skip the initial model message, history should be empty for first user message
    const history = [];
    
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
    });
    
    const result = await chat.sendMessage('how to get a 12 lpa job guide me');
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim() === '') {
      console.log('❌ FAILED: Empty response (safety filter triggered)');
      console.log('\n💡 Solution: Try rephrasing the query or use a different model');
    } else {
      console.log('✅ SUCCESS! Mock Interview is working correctly!\n');
      console.log('Response preview:');
      console.log(text.substring(0, 300) + '...\n');
      console.log('✅ The service is configured correctly.');
      console.log('⚠️  If the browser still shows errors, you need to:');
      console.log('   1. Stop the dev server (Ctrl+C)');
      console.log('   2. Run: npm run dev');
      console.log('   3. Hard refresh browser (Ctrl+Shift+R)');
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('\nFull error:', error);
  }
}

verifyConfiguration();
