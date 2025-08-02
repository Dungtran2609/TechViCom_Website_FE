// Check if backend server is running
import http from 'http';

function checkBackend() {
  const options = {
    hostname: 'localhost',
    port: 8000,
    path: '/api/v1/login',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Backend server status: ${res.statusCode}`);
    console.log('Headers:', res.headers);
    
    res.on('data', (chunk) => {
      console.log('Response chunk:', chunk.toString());
    });
    
    res.on('end', () => {
      console.log('Backend server is running!');
    });
  });

  req.on('error', (error) => {
    console.error('Backend server is not running or not accessible:', error.message);
    console.log('Please make sure your backend server is running on http://localhost:8000');
  });

  req.end();
}

checkBackend(); 