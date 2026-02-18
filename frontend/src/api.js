import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// This automatically adds the token to requests if we have one saved
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers['auth-token'] = localStorage.getItem('token');
  }
  return req;
});

export default API;