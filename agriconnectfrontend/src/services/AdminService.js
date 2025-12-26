import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3130/api", // Your Spring Boot backend URL
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Vendors
export const getPendingVendors = () => api.get("/admins/pending/vendors");
export const approveVendor = (id) => api.put(`/admins/approve/vendor/${id}`);
export const rejectVendor = (id) => api.put(`/admins/reject/vendor/${id}`);

// Experts - CORRECT ENDPOINTS (match your AdminController)
export const getPendingExperts = () => api.get("/admins/pending/experts");
export const approveExpert = (id) => api.put(`/admins/approve/expert/${id}`);
export const rejectExpert = (id) => api.put(`/admins/reject/expert/${id}`);

export default api;