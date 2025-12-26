import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3130/api', // your Spring Boot backend
  withCredentials: true,                // needed if backend uses cookies
  headers: {
    'Content-Type': 'application/json', // JSON payloads
  },
});

export default api;
