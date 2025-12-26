import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaLightbulb, 
  FaShoppingCart, 
  FaSignInAlt, 
  FaUser, 
  FaHistory 
} from "react-icons/fa";
import "./Navbar.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar_logo">AgriConnect</div>

      {/* Hamburger for mobile */}
      <div className="navbar_toggle" onClick={toggleMenu}>☰</div>

      {/* Links */}
      <ul className={`navbar_links ${isOpen ? "active" : ""}`}>

        {/* Common Links */}
        <li className={isActive("/") ? "active" : ""}>
          <Link to="/" onClick={() => setIsOpen(false)}><FaHome /> Home</Link>
        </li>
        {/* <li className={isActive("/soilinfo") ? "active" : ""}>
          <Link to="/soilinfo" onClick={() => setIsOpen(false)}><FaLeaf /> Soil Info</Link>
        </li> */}
        <li className={isActive("/expert-query") ? "active" : ""}>
          <Link to="/expert-query" onClick={() => setIsOpen(false)}><FaLightbulb /> Expert Query</Link>
        </li>
        <li className={isActive("/categories") ? "active" : ""}>
          <Link to="/categories" onClick={() => setIsOpen(false)}>Categories</Link>
        </li>
        <li className={isActive("/products") ? "active" : ""}>
          <Link to="/products" onClick={() => setIsOpen(false)}>Products</Link>
        </li>

        {/* USER Links */}
        {user?.role === "USER" && (
          <>
            <li className={isActive("/orders") ? "active" : ""}>
              <Link to="/orders" onClick={() => setIsOpen(false)}>Order History</Link>
            </li>
            <li className={isActive("/buyer-dashboard") ? "active" : ""}>
              <Link to="/buyer-dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
            </li>
           <li className={isActive("/query-history") ? "active" : ""}>
  <Link to="/query-history" onClick={() => setIsOpen(false)}>
    <FaHistory /> Query History
  </Link>
</li>
            <li className={isActive("/cart") ? "active" : ""}>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="cart-link">
                <FaShoppingCart /> Cart
                {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
              </Link>
            </li>
          </>
        )}

        {/* VENDOR Links */}
        {user?.role === "VENDOR" && (
          <li className={isActive("/vendor-dashboard") ? "active" : ""}>
            <Link to="/vendor-dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          </li>
        )}

        {/* ADMIN Links */}
        {user?.role === "ADMIN" && (
          <li className={isActive("/admin-dashboard") ? "active" : ""}>
            <Link to="/admin-dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          </li>
        )}

        {/* EXPERT Links */}
        {user?.role === "EXPERT" && (
          <li className={isActive("/expert-dashboard") ? "active" : ""}>
            <Link to="/expert-dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          </li>
        )}

        {/* Auth Links */}
        {!user ? (
          <>
            <li>
              <Link to="/login" onClick={() => setIsOpen(false)}><FaSignInAlt /> Login</Link>
            </li>
            <li>
              <Link to="/register" onClick={() => setIsOpen(false)}><FaUser /> Register</Link>
            </li>
          </>
        ) : (
          <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: "#fff" }}>
              {user.firstName || user.name} ({user.role})
            </span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        )}

      </ul>
    </nav>
  );
};

export default Navbar;
