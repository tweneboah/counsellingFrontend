// Debug script to test authentication
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

console.log('=== AUTHENTICATION DEBUG ===');
console.log('Token exists:', !!token);
console.log('User data:', user ? JSON.parse(user) : null);

if (token) {
  console.log('Token length:', token.length);
  
  // Try to decode the JWT payload (without verification)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    console.log('Token expires at:', new Date(payload.exp * 1000));
    console.log('Token is expired:', payload.exp * 1000 < Date.now());
  } catch (e) {
    console.log('Error decoding token:', e.message);
  }

  // Test the actual API call
  console.log('\n=== TESTING API CALL ===');
  fetch('http://localhost:5000/api/admin/dashboard', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    return response.text();
  })
  .then(text => {
    console.log('Response body:', text);
    try {
      const json = JSON.parse(text);
      console.log('Parsed response:', json);
    } catch (e) {
      console.log('Response is not JSON');
    }
  })
  .catch(error => {
    console.log('Fetch error:', error);
  });

  // Also test token refresh
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    console.log('\n=== TESTING TOKEN REFRESH ===');
    fetch('http://localhost:5000/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    })
    .then(response => {
      console.log('Refresh response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Refresh response:', data);
      if (data.token) {
        console.log('New token received, updating localStorage...');
        localStorage.setItem('token', data.token);
        console.log('Try refreshing the page now');
      }
    })
    .catch(error => {
      console.log('Refresh error:', error);
    });
  }
} else {
  console.log('No token found - user needs to login again');
} 