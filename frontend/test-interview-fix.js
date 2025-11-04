// Quick test to verify the fix
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDnyNFy6GwbB_TysaEWdCeeS3vcPUJnNNQ';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testStartInterview() {
  console.log('🧪 Testing Interview Start Fix\n');
  
  try {
    const systemMessage = `You are a friendly but professional HR Manager at a top tech company. 
You are conducting a final-round HR mock interview with a student.

Your goal is to assess their soft skills, personality, and cultural fit.

Instructions:
1. Start by warmly welcoming the student to the final HR round.
2. Ask ONE behavioral question at a time.
3. Wait for the user's response before asking the next question.
4. Your questions should cover topics like teamwork, handling pressure, communication, career goals, and leadership potential.
5. Do NOT ask technical questions. Focus only on behavioral and situational questions.
6. Keep responses concise and conversational.

Start the interview now with your welcome and the first question.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-latest',
      systemInstruction: systemMessage
    });
    
    console.log('📝 Starting interview with system instruction...');
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
    });
    
    const result = await chat.sendMessage('Begin the interview');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Interview started successfully!\n');
    console.log('AI Response:', text.substring(0, 150) + '...\n');
    
    // Test follow-up message
    console.log('📝 Sending follow-up message...');
    const history = [
      { role: 'user', parts: [{ text: 'Begin the interview' }] },
      { role: 'model', parts: [{ text: text }] }
    ];
    
    const chat2 = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
    });
    
    const result2 = await chat2.sendMessage('I have strong teamwork skills from my previous projects.');
    const response2 = await result2.response;
    const text2 = response2.text();
    
    console.log('✅ Follow-up response received!\n');
    console.log('AI Response:', text2.substring(0, 150) + '...\n');
    
    console.log('🎉 Interview flow is working correctly!');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\nFull error:', error);
  }
}

testStartInterview();
