import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterForm.css";
// Axios instance
const api = axios.create({
  baseURL: "http://localhost:3130/api",
});

export default function RegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    address: "",
    role: "USER",
    shopName: "",       // for Vendor
    expertise: "",     // for Expert
    state: "",
    district: "",
    village: "",
    zipCode: "",
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  // Fetch states
  useEffect(() => {
    api.get("/location/states")
      .then((res) => setStates(res.data))
      .catch((err) => console.error("Error fetching states:", err));
  }, []);

  // Fetch districts when state changes
  useEffect(() => {
    if (!formData.state) return;
    api.get("/location/districts", { params: { state: formData.state } })
      .then((res) => setDistricts(res.data))
      .catch((err) => console.error("Error fetching districts:", err));

    setFormData((prev) => ({ ...prev, district: "", village: "", zipCode: "" }));
    setVillages([]);
  }, [formData.state]);

  // Fetch villages when district changes
  useEffect(() => {
    if (!formData.district) return;
    api.get("/location/villages", { params: { district: formData.district } })
      .then((res) => setVillages(res.data))
      .catch((err) => console.error("Error fetching villages:", err));

    setFormData((prev) => ({ ...prev, village: "", zipCode: "" }));
  }, [formData.district]);

  // Fetch zip code when village changes
  useEffect(() => {
    if (!formData.state || !formData.district || !formData.village) return;
    api.get("/location/find", {
      params: {
        state: formData.state,
        district: formData.district,
        subLocation: formData.village,
      },
    })
      .then((res) => setFormData((prev) => ({ ...prev, zipCode: res.data.zipCode || "" })))
      .catch((err) => setFormData((prev) => ({ ...prev, zipCode: "" })));
  }, [formData.state, formData.district, formData.village]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        address: formData.address,
        role: formData.role,
      };

      // Vendor-specific fields
      if (formData.role === "VENDOR") {
        payload.shopName = formData.shopName;
        payload.location = {
          state: formData.state,
          district: formData.district,
          subLocation: formData.village,
          zipCode: formData.zipCode,
        };
      }

      // Expert-specific fields
      if (formData.role === "EXPERT") {
        payload.expertise = formData.expertise; // any extra expert info
      }

      // Role-based URL
      let url = "";
      if (formData.role === "USER") url = "/users/register";
      else if (formData.role === "VENDOR") url = "/vendors/register";
      else if (formData.role === "EXPERT") url = "/experts/register";
      else if (formData.role === "ADMIN") url = "/admins/register";

      await api.post(url, payload, { headers: { "Content-Type": "application/json" } });

      alert("Registration successful! Pending approval if required.");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.response?.data?.message || "Registration failed. Check console.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required /><br />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required /><br />
        <input name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} required /><br />
        <input name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} required /><br />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required /><br />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required /><br />

        <label>
          Role:
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="USER">USER</option>
            <option value="VENDOR">VENDOR</option>
            <option value="EXPERT">EXPERT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label><br />

        {formData.role === "VENDOR" && (
          <>
            <input name="shopName" placeholder="Shop Name" value={formData.shopName} onChange={handleChange} required /><br />

            <label>
              State:
              <select name="state" value={formData.state} onChange={handleChange} required>
                <option value="">Select State</option>
                {states.map((s, i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </label><br />

            <label>
              District:
              <select name="district" value={formData.district} onChange={handleChange} required>
                <option value="">Select District</option>
                {districts.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </label><br />

            <label>
              Village:
              <select name="village" value={formData.village} onChange={handleChange} required>
                <option value="">Select Village</option>
                {villages.map((v, i) => <option key={i} value={v}>{v}</option>)}
              </select>
            </label><br />

            <label>
              Zip Code:
              <input name="zipCode" value={formData.zipCode} readOnly />
            </label><br />
          </>
        )}

        {formData.role === "EXPERT" && (
          <>
            <input name="expertise" placeholder="Your Expertise" value={formData.expertise} onChange={handleChange} required /><br />
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
