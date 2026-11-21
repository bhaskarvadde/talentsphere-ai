import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Jobs.css";
import "./Form.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: "",
    description: "",
    requiredSkills: "",
    experienceRequired: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const API_URL = "http://localhost:8080/api/jobs";

  // Fetch jobs from Spring Boot
  const fetchJobs = async () => {
    try {
      setFetching(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch jobs.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Capture recruiter input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit job details
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      const jobData = {
        ...formData,
        experienceRequired: Number(formData.experienceRequired),
      };

      await axios.post(API_URL, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Job posted successfully!");

      setFormData({
        jobTitle: "",
        description: "",
        requiredSkills: "",
        experienceRequired: "",
      });

      setShowForm(false);

      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to post job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="jobs-page">
      {/* Header */}

      <div className="jobs-header">
        <div>
          <h1>Jobs Management</h1>
          <p>Create and manage your job openings.</p>
        </div>

        <button className="add-job-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Post a Job"}
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}

      {error && <p className="error-message">{error}</p>}

      {/* Create Job Form */}

      {showForm && (
        <div className="job-form-card">
          <h2>Create Job Opening</h2>

          <form onSubmit={handleSubmit}>
            <div className="job-form-grid">
              <div className="form-group">
                <label>Job Title</label>

                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Enter job title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Required Experience (Years)</label>

                <input
                  type="number"
                  name="experienceRequired"
                  min="0"
                  value={formData.experienceRequired}
                  onChange={handleChange}
                  placeholder="Enter experience"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Job Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter job description"
                  rows="5"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Required Skills</label>

                <textarea
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  placeholder="Enter required skills"
                  rows="3"
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-job-btn" disabled={loading}>
              {loading ? "Posting..." : "Publish Job"}
            </button>
          </form>
        </div>
      )}

      {/* Jobs List */}

      <div className="jobs-list-section">
        <h2>Available Job Openings</h2>

        {fetching ? (
          <p className="empty-message">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="empty-message">
            <h3>No jobs available</h3>
            <p>Job openings will appear here when they are available.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job.jobId}>
                <div className="job-card-header">
                  <h3>{job.jobTitle}</h3>
                </div>

                <p className="job-description">{job.description}</p>

                <div className="job-details">
                  <div>
                    <strong>Required Skills</strong>
                    <p>{job.requiredSkills}</p>
                  </div>

                  <div>
                    <strong>Experience Required</strong>
                    <p>{job.experienceRequired}</p>
                  </div>

                  <div>
                    <strong>Recruiter</strong>
                    <p>{job.recruiter?.fullname || "—"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;
