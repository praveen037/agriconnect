import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Create axios instance
const api = axios.create({
  baseURL: "http://localhost:3130/api",
});

export default function AdminPendingVendors() {
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch pending vendors
  const fetchPendingVendors = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admins/pending/vendors");
      setPendingVendors(res.data);
    } catch (err) {
      console.error("Error fetching pending vendors:", err);
      alert("Failed to load pending vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  // Approve or reject vendor
  const handleAction = async (vendorId, action) => {
    try {
      setActionLoading(true);
      const url =
        action === "approve"
          ? `/admins/approve/vendor/${vendorId}`
          : `/admins/reject/vendor/${vendorId}`;
      await api.put(url);
      alert(`Vendor ${action}d successfully`);
      fetchPendingVendors(); // refresh list
    } catch (err) {
      console.error(`Error ${action}ing vendor:`, err);
      alert(`Failed to ${action} vendor.`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Loading pending vendors...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto" }}>
      <h2>Pending Vendors</h2>
      {pendingVendors.length === 0 ? (
        <p>No pending vendors at the moment.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#333", color: "#fff" }}>
              <th style={{ padding: "10px" }}>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Shop</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingVendors.map((vendor) => (
              <tr key={vendor.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px", textAlign: "center" }}>{vendor.id}</td>
                <td>{vendor.firstName} {vendor.lastName}</td>
                <td>{vendor.email}</td>
                <td>{vendor.mobileNumber}</td>
                <td>{vendor.shopName}</td>
                <td>
                  {vendor.location
                    ? `${vendor.location.state}, ${vendor.location.district}, ${vendor.location.subLocation}`
                    : "-"}
                </td>
                <td>
                  <button
                    disabled={actionLoading}
                    style={{
                      marginRight: "5px",
                      padding: "5px 10px",
                      backgroundColor: "green",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleAction(vendor.id, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    disabled={actionLoading}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "red",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleAction(vendor.id, "reject")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
