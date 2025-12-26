// src/pages/PaymentPage.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrder, verifyPayment } from "../services/PaymentService";

const PaymentPage = ({ user = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const totalAmount = location.state?.totalAmount || 100;
  const amountPaise = totalAmount * 100;

  const handlePay = async () => {
    try {
      const orderResp = await createOrder(amountPaise);
      const order = orderResp.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency || "INR",
        order_id: order.id,
        name: "AgriConnect",
        description: "Order Payment",
        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        },
        handler: async function (response) {
          try {
            const verifyResp = await verifyPayment(response);
            if (verifyResp.data.status === "success") {
              navigate("/paymentsuccess");
            } else {
              alert("Payment verification failed.");
            }
          } catch (err) {
            console.error("verify error", err);
            alert("Verification request failed — check console.");
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment popup closed by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("create order error", err);
      alert("Could not create order. Check console.");
    }
  };

  return (
    <div>
      <h3>Pay ₹{totalAmount}</h3>
      <button onClick={handlePay}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
