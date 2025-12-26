import React from "react";
import ProductImage from "./ProductImage";
import "./ProductList.css";

const ProductList = ({ products, onAddToCart, onBuyNow, quantities, onQuantityChange }) => {
  if (!products.length) return <p className="no-products">No products found.</p>;

  return (
    <div className="product-grid">
      {products.map((p) => (
        <div key={p.id} className="product-card">
          <div className="product-image-container">
            <ProductImage src={p.image} alt={p.productName} className="product-image" />
          </div>

          <div className="product-info">
            <h3 className="product-name">{p.productName}</h3>
            <p className="product-description">{p.description}</p>

            <div className="product-price-stock">
              <span className="price"><strong>₹{p.cost}/{p.unit}</strong></span>
              <span className="stock">({p.stockQuantity} available)</span>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <button
                onClick={() => onQuantityChange(p.id, "decrease")}
                disabled={quantities[p.id] <= 1}
              >-</button>
              <span className="quantity">{quantities[p.id]}</span>
              <button
                onClick={() => onQuantityChange(p.id, "increase")}
                disabled={quantities[p.id] >= p.stockQuantity}
              >+</button>
            </div>

            <div className="product-actions">
              <button onClick={() => onAddToCart(p)}>Add to Cart</button>
              <button onClick={() => onBuyNow(p)}>Buy Now</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
