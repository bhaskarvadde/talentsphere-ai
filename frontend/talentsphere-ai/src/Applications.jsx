import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Application.css";
import "./Form.css";

const API_URL = "http://localhost:8080/api/applications";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [formData, setFormData] = useState({
    jobId: "",
    coverLetter: "",
  });

  // Fetch applications from Spring Boot
  const fetchApplications = async () => {
    try {
      const response = await axios.get(API_URL);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchJobs();
  }, []);

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, {
        job: {
          jobId: Number(formData.jobId),
        },
        coverLetter: formData.coverLetter,
      });

      alert("Application submitted successfully!");

      setFormData({
        jobId: "",
        coverLetter: "",
      });

      setShowForm(false);
      fetchApplications();
    } catch (error) {
      console.error("Application submission failed:", error);
      alert("Failed to submit application.");
    }
  };

  // Update application status
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/${id}/status`, {
        applicationStatus: status,
      });

      fetchApplications();
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const candidateName = app.candidate?.user?.fullname || "";
    const jobTitle = app.job?.jobTitle || "";

    const matchesSearch =
      candidateName.toLowerCase().includes(search.toLowerCase()) ||
      jobTitle.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || app.applicationStatus === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="applications-page">
      <div className="applications-header">
        <div>
          <h1>Applications Management</h1>
          <p>Track and manage job applications.</p>
        </div>

        <button
          className="new-application-btn"
          onClick={() => setShowForm(!showForm)}
        >
          + Apply for Job
        </button>
      </div>

      {/* Statistics */}

      <div className="application-stats">
        <div className="application-stat-card">
          <span>Total Applications</span>
          <h2>{applications.length}</h2>
        </div>

        <div className="application-stat-card">
          <span>Pending</span>
          <h2>
            {
              applications.filter((a) => a.applicationStatus === "Pending")
                .length
            }
          </h2>
        </div>

        <div className="application-stat-card">
          <span>Shortlisted</span>
          <h2>
            {
              applications.filter((a) => a.applicationStatus === "Shortlisted")
                .length
            }
          </h2>
        </div>

        <div className="application-stat-card">
          <span>Accepted</span>
          <h2>
            {
              applications.filter((a) => a.applicationStatus === "Accepted")
                .length
            }
          </h2>
        </div>
      </div>

      {/* Application Form */}

      {showForm && (
        <div className="application-form-card">
          <h2>Apply for a Job</h2>

          <form onSubmit={handleSubmit}>
            <div className="application-form-grid">
              <div className="application-field full-width">
                <label>Select Job</label>

                <select
                  value={formData.jobId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jobId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Choose a job</option>

                  {jobs.map((job) => (
                    <option key={job.jobId} value={job.jobId}>
                      {job.jobTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="application-field full-width">
                <label>Cover Letter</label>

                <textarea
                  rows="5"
                  value={formData.coverLetter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      coverLetter: e.target.value,
                    })
                  }
                  placeholder="Write your cover letter..."
                  required
                />
              </div>
            </div>

            <div className="application-form-actions">
              <button
                type="button"
                className="application-cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="application-submit-btn">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}

      <div className="application-toolbar">
        <input
          type="text"
          placeholder="Search candidate or job..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Applications</option>
          <option value="Pending">Pending</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}

      <div className="application-table-card">
        <div className="table-heading">
          <h2>Applications</h2>
          <span>{filteredApplications.length} found</span>
        </div>

        {loading ? (
          <p className="table-message">Loading applications...</p>
        ) : (
          <div className="table-responsive">
            <table className="application-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job Position</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <tr key={app.applicationId}>
                      <td>{app.candidate?.user?.username || "Candidate"}</td>

                      <td>{app.job?.jobTitle || "Job"}</td>

                      <td>{app.appliedDate}</td>

                      <td>
                        <span
                          className={`application-status ${app.applicationStatus?.toLowerCase()}`}
                        >
                          {app.applicationStatus}
                        </span>
                      </td>

                      <td>
                        <select
                          className="status-select"
                          value={app.applicationStatus}
                          onChange={(e) =>
                            updateStatus(app.applicationId, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-applications">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
