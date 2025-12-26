import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductImage from "../components/product/ProductImage";
import { createOrder, verifyPayment } from "../services/PaymentService";
import useRazorpay from "../hooks/useRazorpay";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { initializeRazorpay } = useRazorpay();
  const [loading, setLoading] = useState(false);

  const storedItems = cart.map(item => ({
    id: item.product.id,
    name: item.product.productName,
    price: item.product.cost ?? 0,
    quantity: item.quantity,
    image: item.product.image,
  }));

  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
  });

  const totalAmount = useMemo(() => {
    return storedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [storedItems]);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    try {
      // 1️⃣ Validate shipping
      for (let key in shipping) {
        if (!shipping[key]) {
          alert(`Please fill ${key}`);
          return;
        }
      }

      if (storedItems.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      setLoading(true);
      const amountInPaise = totalAmount * 100;

      // 2️⃣ Create order on backend
      const orderResp = await createOrder(amountInPaise);
      if (!orderResp?.data) throw new Error("Order creation failed");
      const order = orderResp.data;

      // 3️⃣ Razorpay options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_XXXXXXXXXXXX",
        amount: order.amount,
        currency: order.currency || "INR",
        order_id: order.id,
        name: "AgriConnect",
        description: "Order Payment",
        prefill: {
          name: shipping.name,
          email: shipping.email,
          contact: shipping.phone,
        },
        handler: async function (response) {
          try {
            const verifyResp = await verifyPayment(response);
            if (verifyResp?.data?.status === "success") {
              alert("Payment successful!");
              clearCart();
              navigate("/orders");
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed. Try again.");
          }
        },
        modal: {
          ondismiss: () => console.log("Payment popup closed by user"),
        },
        theme: { color: "#4CAF50" },
      };

      // 4️⃣ Open Razorpay
      await initializeRazorpay(options);

    } catch (err) {
      console.error("Payment error:", err);
      alert(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (storedItems.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="checkout-page container">
      <h1>Checkout</h1>

      <h2>Shipping Details</h2>
      <form className="shipping-form">
        {Object.keys(shipping).map((key) => (
          <input
            key={key}
            type={key === "email" ? "email" : "text"}
            name={key}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            value={shipping[key]}
            onChange={handleChange}
          />
        ))}
      </form>

      <h2>Order Summary</h2>
      <div className="order-items">
        {storedItems.map(item => (
          <div key={item.id} className="order-item d-flex align-items-center mb-2">
            <ProductImage
              src={item.image}
              alt={item.name}
              className="order-item-image"
              style={{ width: 80, height: 80, marginRight: 10 }}
            />
            <div>
              <p>{item.name}</p>
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      <h3>Total: ₹{totalAmount}</h3>
      <button
        className="btn btn-success my-3"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default CheckoutPage;
