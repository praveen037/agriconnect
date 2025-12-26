import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductImage from "./ProductImage";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3130/api/product/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser?.id) {
      alert("Please login to buy products.");
      navigate("/login");
      return;
    }

    localStorage.setItem(
      "checkoutItems",
      JSON.stringify([{ product, quantity: 1 }])
    );
    navigate("/checkout");
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">
      <h1>{product.productName}</h1>
      <ProductImage src={product.image} alt={product.productName} style={{ width: "300px" }} />
      <p>{product.description}</p>
      <p><strong>{product.cost} Rs</strong> ({product.stockQuantity} {product.unit})</p>
      <button onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default ProductDetails;
