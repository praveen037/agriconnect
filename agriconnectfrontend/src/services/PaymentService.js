import axios from "axios";
import { getCurrentUser } from "./authService";

const PAYMENT_BASE = "http://localhost:3130/api/payments";

/**
 * Create Razorpay order
 * @param {number} amount - Total amount in paise
 * @param {number} userId - Current user ID
 * @param {Array} cartItems - [{ product, quantity }]
 */
export const createOrder = async (amount, userId, cartItems) => {
  if (!userId) throw new Error("User not logged in");

  const payload = {
    userId,
    amount,
    items: cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.cost
    }))
  };

  try {
    const res = await axios.post(`${PAYMENT_BASE}/create-order`, payload);
    return res.data; // { id, amount, currency, localOrderId, ... }
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    throw new Error(err.response?.data?.error || err.message);
  }
};

/**
 * Verify Razorpay payment
 * @param {Object} payload - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (payload) => {
  try {
    const res = await axios.post(`${PAYMENT_BASE}/verify-payment`, payload);
    return res.data; // { status: "success" } if verified
  } catch (err) {
    console.error("Error verifying payment:", err);
    throw new Error(err.response?.data?.message || err.message);
  }
};
