import React from "react";
import ProductImage from "./ProductImage";
import "./ProductCard.css";

const ProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const { productName, description, cost, unit, stockquantity, image } = product;

  return (
    <div className="product-card">
      <ProductImage src={image} alt={productName} type="product" />

      <div className="product-info">
        <h3 className="product-name">{productName}</h3>
        <p className="product-description">{description}</p>

        <div className="product-price">
          <span className="price">₹{cost}/{unit}</span>
          <span className="stock">Stock: {stockquantity}</span>
        </div>

        <div className="product-actions">
          <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
          <button className="buy-now-btn" onClick={() => onBuyNow(product)}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
