// Final test with gemini-flash-latest
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDnyNFy6GwbB_TysaEWdCeeS3vcPUJnNNQ';
const genAI = new GoogleGenerativeAI(API_KEY);

async function finalTest() {
  console.log('🎯 Final Test: Mock Interview with "how to get an 12 lpa job guide me to get it"\n');
  
  try {
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
    
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
    });
    
    const result = await chat.sendMessage('how to get an 12 lpa job guide me to get it');
    const response = await result.response;
    const text = response.text();
    
    if (!text || text.trim() === '') {
      console.log('❌ Still getting empty response');
    } else {
      console.log('✅ SUCCESS! Response received:\n');
      console.log(text);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

finalTest();
