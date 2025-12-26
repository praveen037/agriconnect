import axios from "axios";
const API_URL = "http://localhost:3130/agriconnect"; // adjust to your backend

export const getProducts = () => axios.get(`${API_URL}/products`);
export const getProduct = (id) => axios.get(`${API_URL}/products/${id}`);
export const placeOrder = (payload) => axios.post(`${API_URL}/orders`, payload);
