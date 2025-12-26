import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserOrders } from "../services/orderService";
import axios from "axios";
import OrderHistory from "./OrderHistory";

const BuyerDashboard = () => {
  const { user, logout, setUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3130/api";

  // Fetch orders and set initial form
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Set form data with current user information
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
    });

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getUserOrders(user.id);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleEditClick = () => {
    // Reset form to current user data when entering edit mode
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      mobileNumber: user.mobileNumber || "",
    });
    setEditMode(true);
    setErrorMsg("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setErrorMsg("");
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      // Validate required fields
      if (!formData.firstName?.trim()) {
        setErrorMsg("First name is required");
        setUpdating(false);
        return;
      }
      if (!formData.lastName?.trim()) {
        setErrorMsg("Last name is required");
        setUpdating(false);
        return;
      }
      if (!formData.email?.trim()) {
        setErrorMsg("Email is required");
        setUpdating(false);
        return;
      }
      if (!formData.mobileNumber?.trim()) {
        setErrorMsg("Mobile number is required");
        setUpdating(false);
        return;
      }

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        mobileNumber: formData.mobileNumber.trim(),
      };

      console.log("Updating user with payload:", payload);
      
      const response = await axios.put(
        `${API_BASE_URL}/users/${user.id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log("Update response:", response.data);
      
      // IMPORTANT: Update the user in context with the response data
      if (response.data) {
        setUser(response.data); // This should update the global user state
        alert("Profile updated successfully!");
        setEditMode(false);
        setErrorMsg("");
      } else {
        throw new Error("No data received from server");
      }
    } catch (err) {
      console.error("Update error:", err);
      
      let errorMessage = "Error updating profile";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout - server is taking too long to respond";
      } else if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      err.response.data || 
                      `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = "No response from server. Please check your backend connection.";
      } else {
        errorMessage = err.message || "Unexpected error occurred";
      }
      
      setErrorMsg(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  // Debug: Log user changes
  useEffect(() => {
    console.log("Current user in dashboard:", user);
  }, [user]);

  if (!user) return <p>Loading user info...</p>;

  // Stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const recentOrders = orders.slice(-5).reverse();

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Welcome, {user.firstName || user.name}</h1>
        <button onClick={handleLogout} style={{ padding: "8px 12px", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* Debug Info - Remove in production */}
      <div style={{ 
        padding: "10px", 
        marginBottom: "20px", 
        backgroundColor: "#f5f5f5", 
        borderRadius: "5px",
        fontSize: "12px",
        border: "1px solid #ddd"
      }}>
        <strong>Debug Info:</strong> User ID: {user.id} | Name: {user.firstName} {user.lastName} | Email: {user.email}
      </div>

      {/* Profile Info */}
      <div style={{ marginBottom: "30px" }}>
        {editMode ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "400px" }}>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              style={{ padding: "6px" }}
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              style={{ padding: "6px" }}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              style={{ padding: "6px" }}
            />
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Mobile Number"
              required
              style={{ padding: "6px" }}
            />

            {errorMsg && (
              <div style={{ 
                color: "red", 
                marginTop: "5px", 
                fontSize: "14px",
                padding: "8px",
                backgroundColor: "#ffe6e6",
                border: "1px solid #ffcccc",
                borderRadius: "4px"
              }}>
                <strong>Error:</strong> {errorMsg}
              </div>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <button 
                onClick={handleSave} 
                disabled={updating}
                style={{ 
                  padding: "6px 12px", 
                  cursor: updating ? "not-allowed" : "pointer",
                  opacity: updating ? 0.6 : 1
                }}
              >
                {updating ? "Saving..." : "Save"}
              </button>
              <button 
                onClick={handleCancel} 
                disabled={updating}
                style={{ 
                  padding: "6px 12px", 
                  cursor: updating ? "not-allowed" : "pointer",
                  opacity: updating ? 0.6 : 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.roleName}</p>
            <p><strong>Mobile:</strong> {user.mobileNumber}</p>
            <button
              style={{ padding: "6px 10px", marginTop: "5px", cursor: "pointer" }}
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <section style={{ marginBottom: "30px" }}>
        <h2>Stats</h2>
        <p><strong>Total Orders:</strong> {totalOrders}</p>
        <p><strong>Total Spent:</strong> ${totalSpent.toFixed(2)}</p>
      </section>

      {/* Recent Orders */}
      <section>
        <h2>Recent Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : recentOrders.length > 0 ? (
          <OrderHistory orders={recentOrders} />
        ) : (
          <p>No orders found.</p>
        )}

        {orders.length > 5 && (
          <button
            style={{ marginTop: "10px", padding: "6px 12px", cursor: "pointer" }}
            onClick={() => navigate("/orders")}
          >
            View All Orders
          </button>
        )}
      </section>
    </div>
  );
};

export default BuyerDashboard;