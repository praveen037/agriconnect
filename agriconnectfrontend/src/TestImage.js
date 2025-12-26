import React, { useEffect, useState } from "react";
import axios from "axios";

const TestImage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3130/product") // your API endpoint
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: "20px" }}>
          <p>{p.productName}</p>
          <img
            src={p.image} // <- USE THE BACKEND URL DIRECTLY
            alt={p.productName}
            style={{ width: "200px", height: "150px", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder.png"; // fallback
            }}
          />
          <p>{p.image}</p>
        </div>
      ))}
    </div>
  );
};

export default TestImage;
