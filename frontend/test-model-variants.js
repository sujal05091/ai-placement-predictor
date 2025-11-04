// Test different model variations
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDnyNFy6GwbB_TysaEWdCeeS3vcPUJnNNQ';
const genAI = new GoogleGenerativeAI(API_KEY);

const modelsToTry = [
  'gemini-2.5-flash',
  'models/gemini-2.5-flash',
  'gemini-flash-latest',
  'models/gemini-flash-latest'
];

async function testModel(modelName) {
  try {
    console.log(`\n🔍 Testing: ${modelName}`);
    
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: `You are an experienced technical interviewer.`
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
      console.log(`⚠️  ${modelName} - Empty response (safety filter)`);
    } else {
      console.log(`✅ ${modelName} - WORKS!`);
      console.log(`Response: ${text.substring(0, 150)}...`);
    }
    
  } catch (error) {
    console.log(`❌ ${modelName} - Error: ${error.message.substring(0, 100)}`);
  }
}

async function testAll() {
  console.log('🎯 Testing which model works best with your query...\n');
  
  for (const model of modelsToTry) {
    await testModel(model);
  }
  
  console.log('\n✅ Test complete!');
}

testAll();
