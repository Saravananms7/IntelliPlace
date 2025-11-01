// Authentication utility with real API integration
import { authAPI } from './api.js';

export const login = async (username, password, userType) => {
  try {
    let response;
    
    if (userType === 'admin') {
      response = await authAPI.loginAdmin(username, password);
    } else if (userType === 'student') {
      response = await authAPI.loginStudent(username, password);
    } else if (userType === 'company') {
      response = await authAPI.loginCompany(username, password);
    } else {
      return { success: false, message: 'Invalid user type' };
    }

    if (response.success && response.token) {
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return { success: true, user: response.user };
    }

    return { success: false, message: response.message || 'Login failed' };
  } catch (error) {
    return { success: false, message: error.message || 'Network error. Please check your connection.' };
  }
};

export const register = async (formData, userType) => {
  try {
    let response;
    
    if (userType === 'student') {
      response = await authAPI.registerStudent(formData);
    } else if (userType === 'company') {
      response = await authAPI.registerCompany(formData);
    } else {
      return { success: false, message: 'Invalid user type' };
    }

    if (response.success && response.token) {
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return { success: true, user: response.user };
    }

    return { success: false, message: response.message || 'Registration failed' };
  } catch (error) {
    return { success: false, message: error.message || 'Network error. Please check your connection.' };
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return token !== null && user !== null;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

