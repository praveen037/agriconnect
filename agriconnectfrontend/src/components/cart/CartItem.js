import React from "react";
import ProductImage from "../product/ProductImage";
import "./CartItem.css";

const CartItem = ({ item, onRemove, onUpdateQty }) => {
  const handleIncrement = () => {
    if (item.quantity < item.stock) onUpdateQty(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) onUpdateQty(item.id, item.quantity - 1);
  };

  return (
    <div className="cart-item">
      {/* Product Image */}
      <div className="cart-item-image">
        <ProductImage src={item.image} alt={item.name} type="product" />
      </div>

      {/* Details Section */}
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-description">{item.description}</p>

        <div className="cart-item-price-stock">
          <span className="cart-item-price">₹{item.price}</span>
          <span className="cart-item-stock">Stock: {item.stock}</span>
        </div>

        <div className="cart-item-actions">
          <div className="cart-quantity">
            <button onClick={handleDecrement} disabled={item.quantity <= 1}>−</button>
            <span>{item.quantity}</span>
            <button onClick={handleIncrement} disabled={item.quantity >= item.stock}>+</button>
          </div>
          <button className="cart-remove" onClick={() => onRemove(item.id)}>Remove</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
