// Test both AI features
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDnyNFy6GwbB_TysaEWdCeeS3vcPUJnNNQ';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testMockInterview() {
  console.log('🎯 Testing Mock Interview...\n');
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: `You are an experienced technical interviewer conducting a mock interview for placement preparation.`
    });
    
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.8,
      },
    });
    
    const result = await chat.sendMessage('I want to prepare for a software developer interview. Can you help me?');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Mock Interview Response:');
    console.log(text + '\n');
    
  } catch (error) {
    console.log('❌ Mock Interview Error:', error.message);
  }
}

async function testCareerGuidance() {
  console.log('💼 Testing Career Guidance...\n');
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: `You are an expert career counselor specializing in tech placements.`
    });
    
    const result = await model.generateContent('How to prepare for interviews?');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Career Guidance Response:');
    console.log(text.substring(0, 200) + '...\n');
    
  } catch (error) {
    console.log('❌ Career Guidance Error:', error.message);
  }
}

async function runTests() {
  await testMockInterview();
  await testCareerGuidance();
  console.log('🎉 All tests complete!');
}

runTests();
