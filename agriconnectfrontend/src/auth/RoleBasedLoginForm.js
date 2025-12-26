import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // axios instance
import { useAuth } from "../context/AuthContext";
import { loginUser } from '../services/authService';

const RoleBasedLoginForm = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      switch (user.role) {
        case "ADMIN":
          navigate("/admin-dashboard");
          break;
        case "VENDOR":
          navigate("/vendor-dashboard");
          break;
        case "USER":
          navigate("/buyer-dashboard");
          break;
        case "EXPERT":
          navigate("/expert-dashboard");
          break;
        default:
          navigate("/login");
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // Determine the login URL based on selected role
    const url =
      formData.role === "USER"
        ? "/users/login"
        : formData.role === "VENDOR"
        ? "/vendors/vendor-login"
        : formData.role === "ADMIN"
        ? "/admins/login"
        : "/experts/login";

    // Payload changes for USER vs others
    const payload =
      formData.role === "USER"
        ? { email: formData.email, password: formData.password }
        : { identifier: formData.email, password: formData.password };

    // Send login request
    const res = await api.post(url, payload);
    const userData = res.data;

    console.log("✅ BACKEND LOGIN RESPONSE:", userData);

    if (!userData || (!userData.id && !userData._id)) {
      setError("Invalid response from server: No user ID found.");
      setLoading(false);
      return;
    }

    // Normalize user object
    const userToStore = {
      ...userData, // include all backend properties
      id: userData.id || userData._id,
      name:
        userData.name ||
        `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
        userData.email,
      role:
        userData.role || userData.userType || userData.type || formData.role, // fallback if backend uses a different field
    };

    console.log("✅ Normalized user:", userToStore);

    // Save user in AuthContext and localStorage
    loginUser(userToStore); // localStorage
    login(userToStore);     // AuthContext

    // Redirect based on actual role
    switch (userToStore.role) {
      case "ADMIN":
        navigate("/admin-dashboard");
        break;
      case "VENDOR":
        navigate("/vendor-dashboard");
        break;
      case "USER":
        navigate("/buyer-dashboard");
        break;
      case "EXPERT":
        navigate("/expert-dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  } catch (err) {
    console.error("Login error:", err.response || err);
    setError(err.response?.data?.message || "Invalid email or password.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <label style={{ display: "block", marginBottom: 10 }}>
          Role:
          <select name="role" value={formData.role} onChange={handleChange} style={{ marginLeft: 10, padding: 5 }}>
            <option value="USER">USER</option>
            <option value="VENDOR">VENDOR</option>
            <option value="ADMIN">ADMIN</option>
            <option value="EXPERT">EXPERT</option>
          </select>
        </label>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      </form>
    </div>
  );
};

export default RoleBasedLoginForm;