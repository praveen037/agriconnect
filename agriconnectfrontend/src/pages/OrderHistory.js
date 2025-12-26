import React from "react";

const OrderHistory = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p>No orders yet.</p>;
  }

  return (
    <table
      border="1"
      cellPadding="10"
      cellSpacing="0"
      style={{ width: "100%", borderCollapse: "collapse" }}
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Total</th>
          <th>Created At</th>
          <th>Items</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.orderStatus}</td>
            <td>₹{order.totalAmount}</td>
            <td>{new Date(order.createdAt).toLocaleString()}</td>
            <td>
              {order.orderItems?.length > 0 ? (
                order.orderItems.map((item) => (
                  <div key={item.id}>
                    Product ID: {item.productId || "N/A"} | Qty: {item.quantity} | Price: ₹
                    {item.price}
                  </div>
                ))
              ) : (
                <span>No items</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderHistory;
