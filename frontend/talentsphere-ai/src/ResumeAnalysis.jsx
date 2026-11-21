
import React, { useState } from "react";
import axios from "axios";
import "./ResumeAnalysis.css";

function ResumeAnalysis() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert extracted skills into an array
  const extractedSkills = Array.isArray(analysis?.extractedSkills)
    ? analysis.extractedSkills
    : (analysis?.extractedSkills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

  // Capture selected resume
  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setAnalysis(null);
    setError("");
  };

  // Upload resume to Spring Boot
  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please upload your resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const response = await axios.post(
        "http://localhost:8080/api/resume-analysis/analyze",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAnalysis(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to analyze resume."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">
      <div className="resume-header">
        <div>
          <h1>AI Resume Analysis</h1>
          <p>Upload your resume to analyze your skills and experience.</p>
        </div>

        <div className="ai-badge">✦ AI Powered</div>
      </div>

      <div className="resume-content">

        {/* Resume Upload */}

        <div className="resume-upload-card">
          <div className="upload-icon">📄</div>

          <h2>Upload Your Resume</h2>

          <p>
            Select your resume to extract skills and analyze your experience.
          </p>

          <label className="upload-area">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />

            <span className="upload-symbol">↑</span>

            <strong>
              {file ? file.name : "Click to upload your resume"}
            </strong>

            <span>PDF, DOC or DOCX</span>
          </label>

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading || !file}
          >
            {loading ? "Analyzing Resume..." : "✦ Analyze Resume"}
          </button>

          {loading && (
            <p className="loading-text">
              Resume analysis is in progress...
            </p>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>

        {/* Analysis Results */}

        {analysis && (
          <div className="analysis-results">

            <div className="results-header">
              <div>
                <h2>Analysis Results</h2>
                <p>{analysis.resumeFileName}</p>
              </div>

              <span className="completed-badge">
                Analysis Completed
              </span>
            </div>

            {/* Overall Score */}

            <div className="score-card">
              <div>
                <span className="score-label">
                  Overall Resume Score
                </span>

                <h2>{analysis.overallScore}/100</h2>
              </div>

              <div
                className="score-circle"
                style={{
                  background: `conic-gradient(
                    #7055df ${analysis.overallScore * 3.6}deg,
                    #eee 0deg
                  )`,
                }}
              >
                <div className="score-inner">
                  <strong>{analysis.overallScore}%</strong>
                </div>
              </div>
            </div>

            {/* Extracted Skills */}

            <div className="result-card">
              <h3>✦ Extracted Skills</h3>

              <div className="extracted-skills">
                {extractedSkills.map((skill, index) => (
                  <span key={index}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Experience Summary */}

            <div className="result-card">
              <h3>Experience Summary</h3>

              <p>{analysis.experienceSummary}</p>
            </div>

          </div>
        )}

        {!analysis && !loading && (
          <div className="empty-analysis">
            <div>🤖</div>

            <h3>Your AI Analysis Will Appear Here</h3>

            <p>
              Upload your resume and click Analyze Resume to view your analysis
              results.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ResumeAnalysis;
