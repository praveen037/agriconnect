import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api"; // Axios instance
import ProductForm from "../components/product/ProductForm";
import "./VendorDashboard.css";

const VendorDashboard = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  // Profile states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    shopName: "",
    address: "",
  });
  const [editProfile, setEditProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Products states
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3130/api";

  // Role check & initialize form
  useEffect(() => {
    if (!user || user.role !== "VENDOR") {
      navigate("/login");
      return;
    }

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
      shopName: user.shopName || "",
      address: user.address || "",
    });

    fetchProducts();
  }, [user, navigate]);

  // Profile handlers
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setProfileError("");
  };

  const handleProfileEdit = () => setEditProfile(true);

  const handleProfileCancel = () => {
    setEditProfile(false);
    setProfileError("");
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
      shopName: user.shopName || "",
      address: user.address || "",
    });
  };

  const handleProfileSave = async () => {
    setUpdatingProfile(true);
    try {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.shopName.trim()) {
        setProfileError("Please fill all required fields");
        setUpdatingProfile(false);
        return;
      }

      const payload = { ...formData };
      const response = await api.put(`${API_BASE_URL}/vendors/${user.id}`, payload);

      if (response.data) {
        setUser(response.data); // update global auth context
        alert("Profile updated successfully!");
        setEditProfile(false);
      }
    } catch (err) {
      console.error(err);
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Products handlers
  const vendorId = user?.id;

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.png";
    if (image.startsWith("http")) return image;
    return `http://localhost:3130/${image.replace(/^\/+/, "")}`;
  };

  const fetchProducts = async () => {
    if (!vendorId) return;
    try {
      setLoadingProducts(true);
      const res = await api.get(`/product/vendor/${vendorId}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductEdit = (product) => setEditingProduct(product);

  const handleProductDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/product/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Delete failed!");
    }
  };

  const handleProductFormSuccess = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="vendor-dashboard">
      {/* Header */}
      <div className="vendor-header">
        <h2>Welcome, {user.firstName}</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Profile Section */}
      <section className="profile-section">
        <h3>My Profile</h3>
        {editProfile ? (
          <div className="profile-form">
            <input name="firstName" value={formData.firstName} onChange={handleProfileChange} placeholder="First Name" />
            <input name="lastName" value={formData.lastName} onChange={handleProfileChange} placeholder="Last Name" />
            <input name="email" value={formData.email} onChange={handleProfileChange} placeholder="Email" />
            <input name="mobileNumber" value={formData.mobileNumber} onChange={handleProfileChange} placeholder="Mobile Number" />
            <input name="shopName" value={formData.shopName} onChange={handleProfileChange} placeholder="Shop Name" />
            <input name="address" value={formData.address} onChange={handleProfileChange} placeholder="Address" />

            {profileError && <p className="error-msg">{profileError}</p>}

            <div className="profile-buttons">
              <button onClick={handleProfileSave} disabled={updatingProfile}>{updatingProfile ? "Saving..." : "Save"}</button>
              <button onClick={handleProfileCancel} disabled={updatingProfile}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile:</strong> {user.mobileNumber}</p>
            <p><strong>Shop Name:</strong> {user.shopName}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <button className="edit-btn" onClick={handleProfileEdit}>Edit Profile</button>
          </div>
        )}
      </section>

      {/* Products Section */}
      <section className="my-products-section">
        <h3>My Products</h3>
        <ProductForm editProduct={editingProduct} onSuccess={handleProductFormSuccess} />
        {loadingProducts ? <p>Loading products...</p> :
          products.length === 0 ? <p>No products found. Add some!</p> :
            <div className="product-grid">
              {products.map((p) => (
                <div key={p.id} className="product-card">
                  <img src={getImageUrl(p.image)} alt={p.productName} />
                  <h4>{p.productName}</h4>
                  <p className="desc">{p.description}</p>
                  <p className="price">{p.cost} Rs ({p.stockQuantity} {p.unit})</p>
                  <div className="product-buttons">
                    <button className="edit-btn" onClick={() => handleProductEdit(p)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleProductDelete(p.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
        }
      </section>
    </div>
  );
};

export default VendorDashboard;
