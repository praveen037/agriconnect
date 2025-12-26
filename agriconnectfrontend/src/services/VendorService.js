import api from "../api/api";

const VendorService = {
  // Admin: Pending vendors
  getPendingVendors: () => api.get("/api/admins/pending/vendors"),
  approveVendor: (id) => api.put(`/api/admins/approve/vendor/${id}`, {}),
  rejectVendor: (id) => api.put(`/api/admins/reject/vendor/${id}`, {}),

  // Vendor CRUD
  getAllVendors: () => api.get("/api/vendors"),
  getVendorById: (id) => api.get(`/api/vendors/${id}`),
  registerVendor: (vendorData) => api.post("/api/vendors/register", vendorData),
  loginVendor: (credentials) => api.post("/api/vendors/vendor-login", credentials),
  updateVendor: (id, vendorData) => api.put(`/api/vendors/${id}`, vendorData),
  deleteVendor: (id) => api.delete(`/api/vendors/${id}`),
};

export default VendorService;
