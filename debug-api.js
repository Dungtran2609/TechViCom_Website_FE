// Debug API calls
import apiClient from './src/api/client.js';
import { userAPI } from './src/api/modules/userAPI.js';

console.log('Testing API client...');

// Test basic API call
async function testAPI() {
  try {
    console.log('Testing login...');
    const result = await userAPI.login('admin@gmail.com', 'admin123');
    console.log('Login result:', result);
  } catch (error) {
    console.error('API test failed:', error);
  }
}

// Test direct fetch
async function testDirectFetch() {
  try {
    console.log('Testing direct fetch...');
    const response = await fetch('http://localhost:8000/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'admin123'
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
  } catch (error) {
    console.error('Direct fetch failed:', error);
  }
}

// Run tests
testAPI();
testDirectFetch(); 