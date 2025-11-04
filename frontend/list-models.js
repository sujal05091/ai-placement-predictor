// List all available Gemini models for your API key
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDnyNFy6GwbB_TysaEWdCeeS3vcPUJnNNQ';
const genAI = new GoogleGenerativeAI(API_KEY);

async function listAvailableModels() {
  try {
    console.log('🔍 Checking available models for your API key...\n');
    
    // Try to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    if (!response.ok) {
      console.log(`❌ Error: ${response.status} ${response.statusText}`);
      const errorData = await response.json();
      console.log('Error details:', JSON.stringify(errorData, null, 2));
      return;
    }
    
    const data = await response.json();
    
    if (data.models && data.models.length > 0) {
      console.log(`✅ Found ${data.models.length} available models:\n`);
      data.models.forEach(model => {
        console.log(`📦 ${model.name}`);
        console.log(`   Display Name: ${model.displayName || 'N/A'}`);
        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ No models available for this API key.');
      console.log('\n⚠️  This means the Generative Language API is NOT enabled!');
      console.log('\n📝 To fix this:');
      console.log('1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
      console.log('2. Select your project');
      console.log('3. Click "ENABLE"');
      console.log('4. Wait 1-2 minutes');
      console.log('5. Run this script again');
    }
    
  } catch (error) {
    console.log('❌ Error listing models:', error.message);
    console.log('\n⚠️  This likely means the Generative Language API is NOT enabled!');
    console.log('\n📝 To fix this:');
    console.log('1. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    console.log('2. Select your project');
    console.log('3. Click "ENABLE"');
    console.log('4. Wait 1-2 minutes');
    console.log('5. Try again');
  }
}

listAvailableModels();
