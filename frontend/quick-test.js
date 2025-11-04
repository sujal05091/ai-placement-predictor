// Quick test of Gemini 2.5 Flash
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDnyNFy6GwbB_TysaEWdCeeS3vcPUJnNNQ';
const genAI = new GoogleGenerativeAI(API_KEY);

async function quickTest() {
  try {
    console.log('🔍 Testing Gemini 2.5 Flash...\n');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Say hello and introduce yourself in one sentence!');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS! Gemini 2.5 Flash is working!\n');
    console.log('Response:', text);
    console.log('\n🎉 Your AI features are now LIVE with real Gemini AI!');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

quickTest();
