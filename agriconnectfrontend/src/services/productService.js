import api from "../api/api";

// Get all products
export const getAllProducts = () => api.get("/product");

// Get product by ID
export const getProductById = (id) => api.get(`/product/${id}`);

// Create new product
export const createProduct = (formData) =>
  api.post("/product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Update product
export const updateProduct = (id, formData) =>
  api.put(`/product/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Delete product
export const deleteProduct = (id) => api.delete(`/product/${id}`);

// Search products by product name or vendor location
export const searchProducts = (searchTerm) =>
  api.get("/product/search", {
    params: { searchTerm: searchTerm || "" },
  });
