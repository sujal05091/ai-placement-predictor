// Test script to try different Gemini model names
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDnyNFy6GwbB_TysaEWdCeeS3vcPUJnNNQ';
const genAI = new GoogleGenerativeAI(API_KEY);

const modelNamesToTry = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'models/gemini-pro',
  'models/gemini-1.5-pro',
  'models/gemini-1.5-flash',
  'gemini-1.5-pro-latest',
  'models/gemini-1.5-pro-latest',
  'gemini-1.5-flash-latest',
  'models/gemini-1.5-flash-latest'
];

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say hi');
    const response = await result.response;
    const text = response.text();
    console.log(`✅ ${modelName} - WORKS! Response: ${text.substring(0, 50)}`);
    return true;
  } catch (error) {
    console.log(`❌ ${modelName}`);
    console.log(`   Error: ${error.message}`);
    if (error.status) console.log(`   Status: ${error.status}`);
    console.log('');
    return false;
  }
}

async function testAllModels() {
  console.log('🔍 Testing Gemini models...\n');
  
  for (const modelName of modelNamesToTry) {
    await testModel(modelName);
  }
  
  console.log('\n✅ Test complete!');
}

testAllModels();
