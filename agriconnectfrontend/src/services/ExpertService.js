import axios from "axios";

const API_BASE = "http://localhost:3130/api/experts";

const ExpertService = {
  // 🔑 Auth
  login: (credentials) => axios.post(`${API_BASE}/login`, credentials),
  register: (data) => axios.post(`${API_BASE}/register`, data),

  // 👥 Expert approvals - FIXED URL PATTERN
  getPendingExperts: () => axios.get(`${API_BASE}/pending`),
  approveExpert: (id) => axios.put(`${API_BASE}/${id}/approve`),  // FIXED: /api/experts/1/approve
  rejectExpert: (id) => axios.put(`${API_BASE}/${id}/reject`),    // FIXED: /api/experts/1/reject

  // ❓ Queries
  getAllQueries: () =>
    axios.get(`${API_BASE}/queries/dto`).catch((error) => {
      console.error("Error fetching queries:", error);
      throw error;
    }),

  getPendingQueries: () =>
    axios.get(`${API_BASE}/queries/pending/dto`).catch((error) => {
      console.error("Error fetching pending queries:", error);
      throw error;
    }),

  getAnsweredQueries: () =>
    axios.get(`${API_BASE}/queries/answered/dto`).catch((error) => {
      console.error("Error fetching answered queries:", error);
      throw error;
    }),

  respondToQuery: (expertId, responseDTO) =>
    axios.post(`${API_BASE}/responses?expertId=${expertId}`, responseDTO, {
      headers: { "Content-Type": "application/json" },
    }),

  // 📝 Submit new query (with optional images)
  submitQuery: (queryRequest, files) => {
    const formData = new FormData();

    formData.append(
      "query",
      new Blob([JSON.stringify(queryRequest)], { type: "application/json" })
    );

    if (files && files.length > 0) {
      files.forEach((file) => formData.append("images", file));
    }

    return axios.post(`${API_BASE}/queries`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default ExpertService;