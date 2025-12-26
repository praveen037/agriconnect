
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { getCurrentUser } from "../services/authService";
// import ProductCard from "../components/product/ProductCard";
// import { getAllProducts, searchProducts } from "../services/productService";
// import "./ProductsPage.css";

// const ProductsPage = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();
//   const { addToCart } = useCart();

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await getAllProducts();
//         setProducts(res.data || []);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     const term = searchTerm.trim();
//     if (!term) {
//       setError("Please enter a search term");
//       return;
//     }
//     setLoading(true);
//     setError("");
//     try {
//       const res = await searchProducts(term);
//       setProducts(res.data || []);
//       if (!res.data || res.data.length === 0) setError("No products found");
//     } catch (err) {
//       console.error(err);
//       setError("Failed to search products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClearSearch = async () => {
//     setSearchTerm("");
//     setError("");
//     setLoading(true);
//     try {
//       const res = await getAllProducts();
//       setProducts(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load products");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = (product) => {
//     const user = getCurrentUser();
//     if (!user?.id) {
//       alert("Please login to add items to cart.");
//       navigate("/login");
//       return;
//     }

//     if (product.stockquantity < 1) {
//       alert("This product is out of stock.");
//       return;
//     }

//     addToCart(product, 1);
//     alert(`${product.productName} added to cart!`);
//   };

//   const handleBuyNow = (product) => {
//     const user = getCurrentUser();
//     if (!user?.id) {
//       alert("Please login to buy products.");
//       navigate("/login");
//       return;
//     }

//     if (product.stockquantity < 1) {
//       alert("This product is out of stock.");
//       return;
//     }

//     addToCart(product, 1);
//     navigate("/cart");
//   };

//   if (loading) return <p style={{textAlign:"center"}}>Loading products...</p>;

//   return (
//     <div className="products-page">
//       <h1>Available Products</h1>

//       <form className="search-form" onSubmit={handleSearch}>
//         <input
//           type="text"
//           placeholder="Search by product name"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <button type="submit">Search</button>
//         {searchTerm && <button type="button" onClick={handleClearSearch}>Clear</button>}
//       </form>

//       {error && <div className="error-message">{error}</div>}

//       <div className="products-grid">
//         {products.length === 0 ? (
//           <p>No products available.</p>
//         ) : (
//           products.map(product => (
//             <ProductCard
//               key={product.id}
//               product={product}
//               onAddToCart={handleAddToCart}
//               onBuyNow={handleBuyNow}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductsPage;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCurrentUser } from "../services/authService";
import ProductCard from "../components/product/ProductCard";
import { getAllProducts, searchProducts } from "../services/productService";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getAllProducts();
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await searchProducts(term);
      setProducts(res.data || []);
      if (!res.data || res.data.length === 0) setError("No products found");
    } catch (err) {
      console.error(err);
      setError("Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchTerm("");
    setError("");
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const user = getCurrentUser();
    if (!user?.id) {
      alert("Please login to add items to cart.");
      navigate("/login");
      return;
    }

    if (product.stockquantity < 1) {
      alert("This product is out of stock.");
      return;
    }

    addToCart(product, 1);
    alert(`${product.productName} added to cart!`);
  };

  const handleBuyNow = (product) => {
    const user = getCurrentUser();
    if (!user?.id) {
      alert("Please login to buy products.");
      navigate("/login");
      return;
    }

    if (product.stockquantity < 1) {
      alert("This product is out of stock.");
      return;
    }

    addToCart(product, 1);
    navigate("/cart");
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading products...</p>;

  return (
    <div className="products-page">
      <h1>Available Products</h1>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
        {searchTerm && (
          <button type="button" onClick={handleClearSearch}>
            Clear
          </button>
        )}
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="products-grid">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
