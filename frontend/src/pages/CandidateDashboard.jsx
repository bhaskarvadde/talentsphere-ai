import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api";
import { Spinner, StatCard, notify } from "../components/UI";
import { StatusPie } from "../components/Views";

export default function CandidateDashboard() {
  const [d, setD] = useState(null);

  useEffect(() => {
    api
      .get("/api/analytics/candidate")
      .then((r) => setD(r.data))
      .catch((e) => notify(errMsg(e), "error"));
  }, []);

  if (!d) return <Spinner text="Loading candidate analytics..." />;

  return (
    <div className="page-wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">Candidate Portal</span>
          <h2 className="section-title">My Career Dashboard</h2>
          <p className="muted small">Track your job applications and monitor your AI match metrics.</p>
        </div>
      </div>

      <div className="stats-bar" style={{ marginBottom: 24 }}>
        <StatCard label="Total Applications" value={d.totalApplications ?? 0} />
        <StatCard label="Avg. AI Match Score" value={d.averageMatchScore ?? "0%"} />
        <StatCard label="Shortlisted Roles" value={d.statusBreakdown?.SHORTLISTED ?? 0} />
        <StatCard label="Offers / Hired" value={d.statusBreakdown?.HIRED ?? 0} />
      </div>

      <div className="grid2">
        <div className="panel">
          <h3 style={{ marginBottom: 16 }}>Application Pipeline Breakdown</h3>
          <StatusPie data={d.statusBreakdown || {}} />
        </div>

        <div className="panel" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ marginBottom: 12 }}>Quick Actions & Tools</h3>
            <p className="muted small" style={{ marginBottom: 20 }}>
              Keep your profile and resume updated to improve matching scores with top companies.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link className="btn btn-primary btn-block" to="/candidate/resume">
                📄 Upload / Audit Resume
              </Link>
              <Link className="btn btn-ghost btn-block" to="/candidate/improve">
                ✨ AI Resume Improvement Assistant
              </Link>
              <Link className="btn btn-ghost btn-block" to="/candidate/applications">
                📋 View Submitted Applications
              </Link>
              <Link className="btn btn-ghost btn-block" to="/jobs">
                🔍 Explore Open Positions
              </Link>
            </div>
          </div>
          <div className="panel glass" style={{ marginTop: 20, padding: 14 }}>
            <span className="eyebrow">Pro Tip</span>
            <p className="muted small" style={{ marginTop: 4 }}>
              Uploading a PDF resume enables TalentSphere's neural parser to analyze your skills and auto-rank you for recruiter openings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
