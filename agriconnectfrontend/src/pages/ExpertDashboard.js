import React, { useState, useEffect, useCallback } from "react";
import ExpertService from "../services/ExpertService";
import { useAuth } from "../context/AuthContext";
import "./ExpertDashboard.css";

export default function ExpertDashboard() {
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);
  const [responses, setResponses] = useState({});
  const [view, setView] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

// Helper: Build full image URL - ENHANCED VERSION
const getImageUrl = (imageFileName) => {
  if (!imageFileName) return "/placeholder.png";
  
  // If it's already a full URL, return as is
  if (imageFileName.startsWith("http")) return imageFileName;
  
  // Otherwise, construct the full URL
  const baseUrl = "http://localhost:3130";
  return `${baseUrl}/uploads/project/queries/${imageFileName}`;
};

const loadQueries = useCallback(async () => {
  setLoading(true);
  setError("");

  try {
    let response;
    switch (view) {
      case "pending":
        response = await ExpertService.getPendingQueries();
        break;
      case "answered":
        response = await ExpertService.getAnsweredQueries();
        break;
      default:
        response = await ExpertService.getAllQueries();
    }

    // Normalize response to array
    let data = [];
    if (Array.isArray(response.data)) data = response.data;
    else if (Array.isArray(response)) data = response;
    else if (response.data && typeof response.data === "object")
      data = Object.values(response.data);

    // 🔥 FIX: Handle both 'images' and 'imagePaths' fields
    const dataWithImages = data.map((q) => {
      // Use 'images' field if available, otherwise fallback to 'imagePaths'
      const images = q.images || q.imagePaths || [];
      
      return {
        ...q,
        images: images.map(getImageUrl), // Ensure all images have full URLs
      };
    });

    setQueries(dataWithImages);
  } catch (err) {
    console.error("API Error:", err);
    setError("Failed to load queries: " + (err.response?.data?.message || err.message));
    setQueries([]);
  } finally {
    setLoading(false);
  }
}, [view]);

  useEffect(() => {
    loadQueries();
  }, [loadQueries]);

  const handleResponseChange = (queryId, value) => {
    setResponses((prev) => ({ ...prev, [queryId]: value }));
  };

  const handleRespond = async (queryId) => {
    const responseText = responses[queryId];
    if (!responseText?.trim()) {
      alert("Please enter a response");
      return;
    }

    try {
      await ExpertService.respondToQuery(user.id, {
        queryId,
        response: responseText,
      });

      alert("Response submitted successfully!");
      loadQueries();

      setResponses((prev) => {
        const newState = { ...prev };
        delete newState[queryId];
        return newState;
      });
    } catch (err) {
      console.error("Response Error:", err);
      alert("Failed to submit response: " + (err.response?.data?.message || err.message));
    }
  };

  const getDisplayName = (query) => {
    if (query.user && (query.user.firstName || query.user.lastName)) {
      const name = `${query.user.firstName || ""} ${query.user.lastName || ""}`.trim();
      return name || "Registered User";
    }
    if (query.userId && query.guestName) return `${query.guestName} ✓`;
    if (query.guestName) return query.guestName;
    if (query.userId) return "Registered User";
    return "Guest User";
  };

  const getContactInfo = (query) => {
    if (query.user && query.user.email)
      return `Email: ${query.user.email} | Phone: ${query.user.phone || "Not provided"}`;
    if (query.guestEmail)
      return `Email: ${query.guestEmail} | Phone: ${query.guestPhone || "Not provided"}`;
    if (query.userId) return "Contact: Registered user details";
    return "Contact information not provided";
  };

  const refreshQueries = () => loadQueries();

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading queries...</p>
      </div>
    );

  return (
    <div className="expert-dashboard">
      <div className="dashboard-header">
        <h2>Expert Dashboard</h2>
        <button onClick={refreshQueries} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="dashboard-controls">
        <div className="view-buttons">
          <button className={view === "all" ? "active" : ""} onClick={() => setView("all")}>
            All Queries
          </button>
          <button className={view === "pending" ? "active" : ""} onClick={() => setView("pending")}>
            Pending Queries
          </button>
          <button className={view === "answered" ? "active" : ""} onClick={() => setView("answered")}>
            Answered Queries
          </button>
        </div>
        <div className="stats">
          <span>Total: {queries.length}</span>
          <span>Pending: {queries.filter((q) => q.status === "PENDING").length}</span>
          <span>Answered: {queries.filter((q) => q.status === "ANSWERED").length}</span>
        </div>
      </div>

      {queries.length === 0 ? (
        <div className="no-queries">
          <p>No {view === "all" ? "" : view} queries found.</p>
          <button onClick={refreshQueries} className="retry-btn">
            Try Again
          </button>
        </div>
      ) : (
        <div className="queries-list">
          {queries.map((query) => (
            <div key={query.id} className="query-card">
              <div className="query-header">
                <div className="query-title-section">
                  <h3 className="query-title">{query.title || "Untitled Query"}</h3>
                  <span className={`status-badge status-${query.status?.toLowerCase() || "pending"}`}>
                    {query.status || "PENDING"}
                  </span>
                </div>
                <div className="query-id">ID: {query.id}</div>
              </div>

              <div className="query-meta">
                <div className="user-info">
                  <p><strong>From:</strong> {getDisplayName(query)}</p>
                  <p><strong>Contact:</strong> {getContactInfo(query)}</p>
                  {query.userId && (
                    <p className="user-id">
                      <strong>User ID:</strong> {query.userId}
                      {query.user ? " (Full details available)" : " (Basic details)"}
                    </p>
                  )}
                </div>
                <div className="query-dates">
                  <p>
                    <strong>Submitted:</strong>{" "}
                    {query.createdAt ? new Date(query.createdAt).toLocaleString() : "Unknown date"}
                  </p>
                  {query.updatedAt && query.updatedAt !== query.createdAt && (
                    <p><strong>Updated:</strong> {new Date(query.updatedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>

              <div className="query-content">
                <div className="description-section">
                  <h4>Description</h4>
                  <p>{query.description || "No description provided"}</p>
                </div>

                {query.isFarmer && (
                  <div className="farmer-info">
                    <h4>Farmer Information</h4>
                    <div className="farmer-details-grid">
                      <div><strong>Type:</strong> {query.isExperienced ? "Experienced Farmer" : "Beginner Farmer"}</div>
                      {query.crops && <div><strong>Crops:</strong> {Array.isArray(query.crops) ? query.crops.join(", ") : query.crops}</div>}
                      {query.soilType && <div><strong>Soil Type:</strong> {query.soilType}</div>}
                      {query.stage && <div><strong>Growth Stage:</strong> {query.stage}</div>}
                      {query.language && <div><strong>Language:</strong> {query.language}</div>}
                    </div>
                  </div>
                )}

                {query.challenges && (
                  <div className="challenges-section">
                    <h4>Challenges</h4>
                    <p>{query.challenges}</p>
                  </div>
                )}

                {(query.nearWaterSource || query.nearFactory || query.surroundingsNotes) && (
                  <div className="surroundings-section">
                    <h4>Field Surroundings</h4>
                    <ul>
                      {query.nearWaterSource && <li>✅ Near water source</li>}
                      {query.nearFactory && <li>🏭 Near factory/industrial area</li>}
                      {query.surroundingsNotes && <li>📝 {query.surroundingsNotes}</li>}
                    </ul>
                  </div>
                )}

                {(query.state || query.district || query.mandal) && (
                  <div className="location-section">
                    <h4>Location</h4>
                    <p>{[query.state, query.district, query.mandal].filter(Boolean).join(", ")}</p>
                  </div>
                )}

                {/* Images */}
                {query.images.length > 0 && (
                  <div className="images-section">
                    <h4>Attached Images ({query.images.length})</h4>
                    <div className="images-grid">
                      {query.images.map((img, index) => (
                        <div key={index} className="image-container">
                          <img
                            src={img}
                            alt={`Query ${query.id} - Image ${index + 1}`}
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                              e.target.alt = "Image not available";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Response Section */}
              {(!query.status || query.status === "PENDING") && (
                <div className="response-section">
                  <h4>Your Response</h4>
                  <textarea
                    placeholder="Provide your expert advice..."
                    value={responses[query.id] || ""}
                    onChange={(e) => handleResponseChange(query.id, e.target.value)}
                    rows={5}
                  />
                  <button
                    onClick={() => handleRespond(query.id)}
                    disabled={!responses[query.id]?.trim()}
                    className="submit-response-btn"
                  >
                    Submit Response
                  </button>
                </div>
              )}

              {/* Existing Responses */}
              {query.responses && query.responses.length > 0 && (
                <div className="existing-responses">
                  <h4>Expert Responses ({query.responses.length})</h4>
                  {query.responses.map((resp) => (
                    <div key={resp.id} className="response-item">
                      <div className="response-content">
                        <p>{resp.response}</p>
                      </div>
                      <div className="response-meta">
                        <span>
                          By: {resp.expert ? `${resp.expert.firstName} ${resp.expert.lastName}` : "Expert"}
                        </span>
                        <span>
                          on {resp.createdAt ? new Date(resp.createdAt).toLocaleString() : "Recent"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}