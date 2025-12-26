import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const QueryHistory = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null); // For collapsible sections

  useEffect(() => {
    if (!userId) return;

    const fetchQueryHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3130/api/queries/my?userId=${userId}`
        );
        setQueries(res.data);
      } catch (err) {
        console.error("Error fetching query history:", err);
        setError("Failed to load query history.");
      } finally {
        setLoading(false);
      }
    };

    fetchQueryHistory();
  }, [userId]);

  if (loading) return <p>Loading query history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (queries.length === 0) return <p>No queries found.</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "2rem auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Your Query History</h2>

      {queries.map((q) => (
        <div
          key={q.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "2rem",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          {/* Query Title */}
          <div
            onClick={() => setOpenId(openId === q.id ? null : q.id)}
            style={{ cursor: "pointer" }}
          >
            <h3 style={{ color: "#2E8B57", marginBottom: "0.5rem" }}>{q.title}</h3>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              Created on: {new Date(q.createdAt).toLocaleString()}
            </p>
          </div>

          {openId === q.id && (
            <div style={{ marginTop: "1rem" }}>
              {/* Description */}
              <p>{q.description}</p>

              {/* User Info */}
              <h4 style={{ marginTop: "1rem", color: "#333" }}>👤 User Information</h4>
              <ul>
                <li>
                  <b>Name:</b> {q.guestName || (user ? `${user.firstName} ${user.lastName}` : "N/A")}
                </li>
                <li>
                  <b>Email:</b> {q.guestEmail || (user ? user.email : "N/A")}
                </li>
                <li>
                  <b>Phone:</b> {q.guestPhone || (user ? user.mobileNumber : "N/A")}
                </li>
                <li><b>Farmer:</b> {q.isFarmer ? "Yes" : "No"}</li>
                {q.isFarmer && <li><b>Experienced Farmer:</b> {q.isExperienced ? "Yes" : "No"}</li>}
              </ul>

              {/* Farming Info */}
              <h4 style={{ marginTop: "1rem", color: "#333" }}>🌾 Farming Information</h4>
              <ul>
                {q.crops?.length > 0 && <li><b>Crops:</b> {q.crops.join(", ")}</li>}
                {q.soilType && <li><b>Soil Type:</b> {q.soilType}</li>}
                {q.stage && <li><b>Crop Stage:</b> {q.stage}</li>}
                {q.irrigation && <li><b>Irrigation:</b> {q.irrigation}</li>}
                {q.pests && <li><b>Pests:</b> {q.pests}</li>}
                {q.fertilizers && <li><b>Fertilizers:</b> {q.fertilizers}</li>}
                {q.yieldAdvice && <li><b>Yield Advice:</b> {q.yieldAdvice}</li>}
                {q.guidanceNeeded && <li><b>Guidance Needed:</b> {q.guidanceNeeded}</li>}
                {q.interestedIn?.length > 0 && <li><b>Interested In:</b> {q.interestedIn.join(", ")}</li>}
              </ul>

              {/* Surroundings */}
              <h4 style={{ marginTop: "1rem", color: "#333" }}>🌍 Field Surroundings</h4>
              <ul>
                <li><b>Near Water Source:</b> {q.nearWaterSource ? "Yes" : "No"}</li>
                <li><b>Near Factory:</b> {q.nearFactory ? "Yes" : "No"}</li>
                {q.surroundingsNotes && <li><b>Notes:</b> {q.surroundingsNotes}</li>}
              </ul>

              {/* Location */}
              <h4 style={{ marginTop: "1rem", color: "#333" }}>📍 Location</h4>
              <ul>
                <li><b>State:</b> {q.state || "N/A"}</li>
                <li><b>District:</b> {q.district || "N/A"}</li>
                <li><b>Mandal/Village:</b> {q.mandal || "N/A"}</li>
              </ul>

              {/* Challenges */}
              {q.challenges && (
                <>
                  <h4 style={{ marginTop: "1rem", color: "#333" }}>🚜 Challenges</h4>
                  <p>{q.challenges}</p>
                </>
              )}

              {/* Uploaded Images */}
              {q.images?.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <h4>📷 Uploaded Images</h4>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {q.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`query-${q.id}-${idx}`}
                        style={{ width: "150px", borderRadius: "6px" }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Expert Responses */}
              <div style={{ marginTop: "1.5rem" }}>
                <h4 style={{ color: "#4CAF50" }}>💬 Expert Responses</h4>
                {(q.responses || []).length === 0 ? (
                  <p style={{ marginLeft: "1rem", color: "#777" }}>No responses yet</p>
                ) : (
                  q.responses.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        marginLeft: "1rem",
                        marginTop: "0.5rem",
                        padding: "0.7rem",
                        borderLeft: "3px solid #4CAF50",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "6px",
                      }}
                    >
                      <p>{r.response}</p>
                      <small style={{ color: "#666" }}>
                        {new Date(r.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QueryHistory;
