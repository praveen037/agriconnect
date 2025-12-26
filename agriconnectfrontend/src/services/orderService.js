import axios from "axios";
import { getCurrentUser } from "./authService";

const API_BASE = "http://localhost:3130/api/orders";

/**
 * Place an order and create Razorpay order
 * @param {Array} items - [{ productId, productName, price, quantity }]
 * @param {Number} amount - Total amount in INR
 */
export const placeOrder = async (items, amount) => {
  const user = getCurrentUser();
  if (!user?.id) throw new Error("User not logged in");

  const payload = {
    orderId: Date.now(), // or a proper order ID from backend DB
    amount,
    items,
  };

  const res = await axios.post(`${API_BASE}/place`, payload);
  return res.data; // returns Razorpay order info
};

/**
 * Verify payment after successful transaction
 * @param {Object} payload - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (payload) => {
  const res = await axios.post(`${API_BASE}/verify`, payload);
  return res.data;
};

/**
 * Get orders of current logged-in user
 */
export const getUserOrders = async () => {
  const user = getCurrentUser();
  if (!user?.id) throw new Error("User not logged in");

  const res = await axios.get(`${API_BASE}/my-orders?userId=${user.id}`);
  return res.data;
};

/**
 * Optional: Checkout cart (if you have a separate checkout API)
 */
export const checkoutCart = async (deliveryDto = null) => {
  const user = getCurrentUser();
  if (!user?.id) throw new Error("User not logged in");

  const res = await axios.post(`${API_BASE}/checkout?userId=${user.id}`, deliveryDto || {});
  return res.data;
};
