import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminPendingVendors from "../components/admin/AdminPendingVendors";
import AdminPendingExperts from "../components/admin/AdminPendingExperts";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("vendors");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: "1000px", margin: "20px auto", padding: "0 10px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: "20px" }}>
            {user.name} ({user.email})
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 15px",
              backgroundColor: "red",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", margin: "20px 0" }}>
        <button
          onClick={() => setActiveTab("vendors")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activeTab === "vendors" ? "#333" : "#eee",
            color: activeTab === "vendors" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Pending Vendors
        </button>
        <button
          onClick={() => setActiveTab("experts")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "experts" ? "#333" : "#eee",
            color: activeTab === "experts" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Pending Experts
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "vendors" && <AdminPendingVendors />}
        {activeTab === "experts" && <AdminPendingExperts />}
      </div>
    </div>
  );
}
