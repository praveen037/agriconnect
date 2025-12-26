
import React, { useState } from "react";
import ExpertService from "../../services/ExpertService";
import "./ExpertQueryForm.css";
import { useAuth } from "../../context/AuthContext";

export default function ExpertQueryForm() {
  const { user } = useAuth();

  const initialFormState = {
    title: "",
    description: "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    isFarmer: false,
    isExperienced: false,
    planningToFarm: false,
    landAccess: false,
    language: "",
    crops: "",
    stage: "",
    soilType: "",
    irrigation: "",
    pests: "",
    fertilizers: "",
    yieldAdvice: "",
    interestedIn: "",
    guidanceNeeded: "",
    challenges: "",
    imagesFiles: [],
    surroundings: { nearWaterSource: false, nearFactory: false, notes: "" },
    state: "",
    district: "",
    mandal: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("surroundings.")) {
      const key = name.split(".")[1];
      setForm({
        ...form,
        surroundings: { ...form.surroundings, [key]: type === "checkbox" ? checked : value },
      });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, imagesFiles: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // DEBUG: Check what user data we have
    console.log("Current user:", user);
    console.log("Form data before submission:", form);

    // Prepare the payload - CRITICAL FIX: Only use guest fields when no user is logged in
    const payload = {
      title: form.title,
      description: form.description,
      // ONLY use guest fields when user is NOT logged in
      guestName: user ? null : form.guestName, // null for logged-in users
      guestEmail: user ? null : form.guestEmail, // null for logged-in users
      guestPhone: user ? null : form.guestPhone, // null for logged-in users
      isFarmer: form.isFarmer,
      isExperienced: form.isExperienced,
      planningToFarm: form.planningToFarm,
      landAccess: form.landAccess,
      language: form.language,
      crops: form.crops ? form.crops.split(",").map((c) => c.trim()).filter(c => c !== "") : [],
      stage: form.stage,
      soilType: form.soilType,
      irrigation: form.irrigation,
      pests: form.pests,
      fertilizers: form.fertilizers,
      yieldAdvice: form.yieldAdvice,
      interestedIn: form.interestedIn ? form.interestedIn.split(",").map((c) => c.trim()).filter(c => c !== "") : [],
      guidanceNeeded: form.guidanceNeeded,
      challenges: form.challenges,
      surroundingsNotes: form.surroundings.notes,
      nearWaterSource: form.surroundings.nearWaterSource,
      nearFactory: form.surroundings.nearFactory,
      state: form.state,
      district: form.district,
      mandal: form.mandal,
      userId: user ? user.id : null, // This is the key field for user association
    };

    console.log("Submitting payload:", payload);

    try {
      await ExpertService.submitQuery(payload, form.imagesFiles);
      setMessage("Query submitted successfully!");
      setForm(initialFormState);
      
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("Submission Error:", err);
      setMessage("Failed to submit query: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(initialFormState);
    setMessage("");
  };

  // Don't show guest fields when user is logged in
  const showGuestFields = !user;

  return (
    <div className="expert-query-form">
      <h2>Submit Expert Query</h2>
      
      {message && (
        <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
          {message}
        </div>
      )}
      
      <div className="user-info">
        {user ? (
          <div className="logged-in-info">
            <p><strong>✅ Logged in as:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>📧 Email:</strong> {user.email}</p>
            {/* FIXED: Changed user.phone to user.mobileNumber */}
            <p><strong>📞 Phone:</strong> {user.mobileNumber || 'Not provided'}</p>
            <p><strong>👤 User ID:</strong> {user.id}</p>
            <p className="note">Your query will be associated with your account automatically.</p>
          </div>
        ) : (
          <div className="guest-info">
            <p><strong>👤 Guest User</strong> - Please provide your contact information below</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="required">Title *</label>
          <input
            id="title"
            name="title"
            placeholder="Enter query title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="required">Description *</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your query in detail"
            value={form.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        {/* ONLY show guest fields when user is NOT logged in */}
        {showGuestFields && (
          <div className="guest-fields">
            <h3>Your Information</h3>
            <div className="form-group">
              <label htmlFor="guestName" className="required">Your Name *</label>
              <input
                id="guestName"
                name="guestName"
                placeholder="Enter your full name"
                value={form.guestName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="guestEmail" className="required">Email *</label>
              <input
                id="guestEmail"
                name="guestEmail"
                type="email"
                placeholder="Enter your email"
                value={form.guestEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="guestPhone">Phone</label>
              <input
                id="guestPhone"
                name="guestPhone"
                placeholder="Enter your phone number"
                value={form.guestPhone}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isFarmer"
              checked={form.isFarmer}
              onChange={handleChange}
            />
            Are you a farmer?
          </label>
        </div>

        {form.isFarmer && (
          <div className="farmer-details">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isExperienced"
                  checked={form.isExperienced}
                  onChange={handleChange}
                />
                Experienced Farmer?
              </label>
            </div>

            {form.isExperienced ? (
              <>
                <div className="form-group">
                  <label htmlFor="crops">Crops Grown</label>
                  <input
                    id="crops"
                    name="crops"
                    placeholder="Enter crops (comma separated) e.g., wheat, tomato"
                    value={form.crops}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="soilType">Soil Type</label>
                  <input
                    id="soilType"
                    name="soilType"
                    placeholder="e.g., black soil, red soil"
                    value={form.soilType}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="stage">Current Crop Stage</label>
                  <input
                    id="stage"
                    name="stage"
                    placeholder="e.g., sowing, growing, harvesting"
                    value={form.stage}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="irrigation">Irrigation Methods</label>
                  <input
                    id="irrigation"
                    name="irrigation"
                    placeholder="e.g., drip, sprinkler, flood"
                    value={form.irrigation}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pests">Pests Issues</label>
                  <input
                    id="pests"
                    name="pests"
                    placeholder="Describe pest problems"
                    value={form.pests}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fertilizers">Fertilizers Used</label>
                  <input
                    id="fertilizers"
                    name="fertilizers"
                    placeholder="List fertilizers used"
                    value={form.fertilizers}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="yieldAdvice">Yield Improvement Advice Needed</label>
                  <input
                    id="yieldAdvice"
                    name="yieldAdvice"
                    placeholder="Specific yield-related questions"
                    value={form.yieldAdvice}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="planningToFarm"
                      checked={form.planningToFarm}
                      onChange={handleChange}
                    />
                    Planning to start farming?
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="interestedIn">Interested Crops</label>
                  <input
                    id="interestedIn"
                    name="interestedIn"
                    placeholder="Crops you're interested in (comma separated)"
                    value={form.interestedIn}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="guidanceNeeded">Guidance Needed</label>
                  <input
                    id="guidanceNeeded"
                    name="guidanceNeeded"
                    placeholder="What guidance do you need?"
                    value={form.guidanceNeeded}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="landAccess"
                      checked={form.landAccess}
                      onChange={handleChange}
                    />
                    Do you have access to land?
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="language">Preferred Language</label>
                  <input
                    id="language"
                    name="language"
                    placeholder="e.g., English, Hindi, Telugu"
                    value={form.language}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="challenges">Challenges Faced</label>
          <textarea
            id="challenges"
            name="challenges"
            placeholder="Describe any challenges you are facing"
            value={form.challenges}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="images">Attach Image(s) of Crop (optional)</label>
          <input 
            id="images"
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
          <small>You can select multiple images</small>
        </div>

        {form.imagesFiles.length > 0 && (
          <div className="image-preview">
            <p><strong>Selected Images:</strong></p>
            <div className="preview-grid">
              {form.imagesFiles.map((file, idx) => (
                <div key={idx} className="preview-item">
                  <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="surroundings-section">
          <h3>Field Surroundings</h3>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="surroundings.nearWaterSource"
                checked={form.surroundings.nearWaterSource}
                onChange={handleChange}
              />
              Near Water Source?
            </label>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="surroundings.nearFactory"
                checked={form.surroundings.nearFactory}
                onChange={handleChange}
              />
              Near Factory?
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="surroundingsNotes">Other Surrounding Notes</label>
            <input
              id="surroundingsNotes"
              name="surroundings.notes"
              placeholder="Any other notes about surroundings"
              value={form.surroundings.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="location-section">
          <h3>Location Information</h3>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              id="state"
              name="state"
              placeholder="Enter state"
              value={form.state}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              id="district"
              name="district"
              placeholder="Enter district"
              value={form.district}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="mandal">Mandal/Village</label>
            <input
              id="mandal"
              name="mandal"
              placeholder="Enter mandal or village"
              value={form.mandal}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? "Submitting..." : "Submit Query"}
          </button>
          <button 
            type="button" 
            onClick={resetForm}
            className="reset-btn"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}