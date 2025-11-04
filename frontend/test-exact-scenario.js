// Test the exact user scenario
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDnyNFy6GwbB_TysaEWdCeeS3vcPUJnNNQ';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testExactScenario() {
  console.log('🎯 Testing: "hi guide me to get 12 lpa job"\n');
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
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
    
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
    });
    
    const result = await chat.sendMessage('hi guide me to get 12 lpa job');
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim() === '') {
      console.log('⚠️  Empty response detected (safety filter triggered)');
      console.log('✅ Fallback message will be shown to user:\n');
      console.log("I understand you're looking for career guidance. Let me help you with that! Could you please rephrase your question or be more specific about what aspect you'd like to focus on?");
    } else {
      console.log('✅ Response received:');
      console.log(text);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testExactScenario();
