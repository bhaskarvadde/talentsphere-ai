import React, { useState } from "react";
import axios from "axios";
import "./CandidateRegister.css";
import "./Form.css";

function CandidateRegister() {
  const [formData, setFormData] = useState({
    phone: "",
    education: "",
    experienceYears: "",
    resumeUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8080/api/candidates",
        {
          ...formData,
          experienceYears: Number(formData.experienceYears),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage(response.data.message || "Profile completed successfully.");

      setFormData({
        phone: "",
        education: "",
        experienceYears: "",
        resumeUrl: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to complete registration.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-page">
      <div className="candidate-card">
        <div className="candidate-header">
          <h1>Complete Your Profile</h1>
          <p>Enter your professional details to complete your profile.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="form-group">
              <label>Education</label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Enter your education"
                required
              />
            </div>

            <div className="form-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                name="experienceYears"
                min="0"
                value={formData.experienceYears}
                onChange={handleChange}
                placeholder="Enter experience"
                required
              />
            </div>

            <div className="form-group">
              <label>Resume URL</label>
              <input
                type="url"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                placeholder="Enter resume URL"
              />
            </div>
          </div>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CandidateRegister;
