import axios from "axios";

const API_URL = "http://localhost:3130/api/cart";

// Get the user's cart
export const getCart = (userId) => axios.get(`${API_URL}/${userId}`);

// Add an item to the cart (query params for Spring Boot)
export const addItemToCart = (userId, productId, quantity) =>
  axios.post(`${API_URL}/${userId}/add`, null, { params: { productId, quantity } });

// Update item quantity
export const updateItemQuantity = (userId, productId, quantity) =>
  axios.put(`${API_URL}/${userId}/update`, null, { params: { productId, quantity } });

// Remove item from cart
export const removeItemFromCart = (userId, productId) =>
  axios.delete(`${API_URL}/${userId}/items/${productId}`);

export const clearCart = (userId) =>
  axios.delete(`${API_URL}/${userId}/clear`);
