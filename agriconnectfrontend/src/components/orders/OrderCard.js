// import React, { useState } from "react";
// import { getImageUrl } from "../../utils/imageUrl";
// import "./OrderCard.css";

// const OrderCard = ({ order }) => {
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <div className="order-card">
//       {/* Order Header */}
//       <div className="order-header" onClick={() => setExpanded(!expanded)}>
//         <h3>Order #{order.id}</h3>
//         <span>Status: {order.orderStatus}</span>
//         <span className="expand-icon">{expanded ? "▲" : "▼"}</span>
//       </div>

//       {/* Expandable Items */}
//       {expanded && (
//         <div className="order-items">
//           {order.orderItems?.map((item) => (
//             <div key={item.id} className="order-item">
//               <img
//                 src={getImageUrl(item.product?.image)}   // ✅ fixed image
//                 alt={item.product?.productName || "Product"}
//                 style={{
//                   width: 80,
//                   height: 80,
//                   objectFit: "cover",
//                   marginRight: 10,
//                 }}
//               />
//               <div className="item-info">
//                 <h4>{item.product?.productName ?? "Unknown Product"}</h4>
//                 <p>Qty: {item.quantity}</p>
//                 <p>Price: ₹{item.product?.cost ?? item.price ?? 0}</p>
//                 <p>Total: ₹{item.total}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Order Footer */}
//       <div className="order-footer">
//         <p>Total: ₹{order.totalAmount}</p>
//         <p>Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
//       </div>
//     </div>
//   );
// };

// export default OrderCard;
import React, { useState } from "react";
import ProductImage from "../product/ProductImage";
import "./OrderCard.css";

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const orderItems = order.orderItems ?? [];

  return (
    <div className="order-card">
      {/* Header */}
      <div className="order-header" onClick={() => setExpanded(!expanded)}>
        <h3>Order #{order.id}</h3>
        <span>Status: {order.orderStatus}</span>
        <span className="expand-icon">{expanded ? "▲" : "▼"}</span>
      </div>

      {/* Items */}
      {expanded && (
        <div className="order-items">
          {orderItems.length > 0 ? (
            orderItems.map((item) => {
              const price = item.price ?? 0;
              const total = item.total ?? price * (item.quantity ?? 1);

              return (
                <div key={item.id} className="order-item">
                  <ProductImage
                    src={item.productImage}
                    alt={item.productName ?? "Unknown Product"}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      marginRight: 10,
                    }}
                  />
                  <div className="item-info">
                    <h4>{item.productName ?? "Unknown Product"}</h4>
                    <p>Qty: {item.quantity ?? 1}</p>
                    <p>Price: ₹{price.toLocaleString("en-IN")}</p>
                    <p>Total: ₹{total.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No items in this order.</p>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="order-footer">
        <p>
          <strong>Total: </strong>₹{(order.totalAmount ?? 0).toLocaleString("en-IN")}
        </p>
        <p>
          <strong>Ordered on: </strong>{new Date(order.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;
