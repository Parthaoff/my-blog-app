import axios from 'axios';

const API = axios.create({
  baseURL: 'https://my-blog-app-1-fszm.onrender.com',
});

// This automatically adds the token to requests if we have one saved
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers['auth-token'] = localStorage.getItem('token');
  }
  return req;
});


export default API;

