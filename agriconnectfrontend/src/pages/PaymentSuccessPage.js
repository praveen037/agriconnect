import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState({ items: [], totalAmount: 0 });
  const [counter, setCounter] = useState(5);

  // Load last order from sessionStorage
  useEffect(() => {
    const lastOrder = JSON.parse(sessionStorage.getItem("lastOrder") || "{}");
    if (lastOrder.items) setOrder(lastOrder);

    // Clear storage after reading
    sessionStorage.removeItem("lastOrder");
  }, []);

  // Countdown redirect to home
  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [counter, navigate]);

  const handleDownloadInvoice = () => {
    let content = `Invoice - AgriConnect\n\n`;
    order.items.forEach(item => {
      content += `${item.name} - Qty: ${item.quantity} - ₹${item.price * item.quantity}\n`;
    });
    content += `\nTotal: ₹${order.totalAmount}\n\nThank you for your purchase!`;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${new Date().getTime()}.txt`;
    link.click();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="150"
        width="150"
        viewBox="0 0 512 512"
      >
        <path
          fill="#31f218"
          d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"
        />
      </svg>

      <h2>Payment Successful!</h2>

      {order.items.length > 0 && (
        <div style={{ textAlign: "left", margin: "20px 0" }}>
          <h4>Order Summary:</h4>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} x {item.quantity} — ₹{item.price * item.quantity}
              </li>
            ))}
            <li>
              <strong>Total — ₹{order.totalAmount}</strong>
            </li>
          </ul>
        </div>
      )}

      <button onClick={handleDownloadInvoice} style={{ margin: "20px 0", padding: "10px 20px" }}>
        Download Invoice
      </button>

      <p>
        You will be redirected to the home page in <b>{counter}</b> seconds
      </p>
    </div>
  );
};

export default PaymentSuccessPage;
