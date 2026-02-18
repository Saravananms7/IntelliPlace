import { API_BASE_URL } from '../config.js';
console.log('API Base URL:', API_BASE_URL); // Debug log

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    mode: 'cors',
    credentials: 'include',
  };
  
  // Debug logging
  console.log('API Call:', `${API_BASE_URL}${endpoint}`);
  console.log('Request Config:', config);

  try {
    console.log('Making API request to:', `${API_BASE_URL}${endpoint}`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    console.log('Response status:', response.status);
    
    let data;
    const textResponse = await response.text();
    try {
      data = JSON.parse(textResponse);
      console.log('Response data:', data);
    } catch (e) {
      console.error('Failed to parse JSON response:', textResponse);
      throw new Error('Invalid JSON response from server');
    }
    
    if (!response.ok) {
      console.error('API Error Response:', data);
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  // Student Registration
  registerStudent: async (formData) => {
    return apiCall('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        rollNumber: formData.rollNumber,
        phone: formData.phone,
      }),
    });
  },

  // Company Registration
  registerCompany: async (formData) => {
    return apiCall('/auth/register/company', {
      method: 'POST',
      body: JSON.stringify({
        companyName: formData.companyName,
        email: formData.email,
        password: formData.password,
        industry: formData.industry,
        website: formData.website,
        phone: formData.phone,
      }),
    });
  },

  // Student Login
  loginStudent: async (email, password) => {
    return apiCall('/auth/login/student', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Company Login
  loginCompany: async (email, password) => {
    return apiCall('/auth/login/company', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Admin Login
  loginAdmin: async (username, password) => {
    return apiCall('/auth/login/admin', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

export default apiCall;

