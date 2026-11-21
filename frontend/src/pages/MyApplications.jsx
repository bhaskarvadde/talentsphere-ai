import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api";
import { ProgressBar, Spinner, StatusBadge, fmtDate, notify } from "../components/UI";

export default function MyApplications() {
  const [apps, setApps] = useState(null);

  useEffect(() => {
    api
      .get("/api/applications/mine")
      .then((r) => setApps(Array.isArray(r.data) ? r.data : []))
      .catch((e) => {
        notify(errMsg(e), "error");
        setApps([]);
      });
  }, []);

  if (!apps) return <Spinner text="Loading your application status..." />;

  return (
    <div className="page-wrap">
      <div className="section-head between">
        <div>
          <span className="eyebrow">Application Tracker</span>
          <h2 className="section-title">My Applications</h2>
          <p className="muted small">Review your submitted job applications and their real-time hiring status.</p>
        </div>
        <Link to="/jobs" className="btn btn-ghost btn-sm">
          + Explore More Jobs
        </Link>
      </div>

      {apps.length === 0 ? (
        <div className="panel empty-box">
          <h3>No applications submitted yet</h3>
          <p className="muted small" style={{ marginBottom: 16 }}>
            Browse open positions, check your AI compatibility, and apply in seconds.
          </p>
          <Link to="/jobs" className="btn btn-primary">
            Explore Open Jobs
          </Link>
        </div>
      ) : (
        <div className="panel scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Applied On</th>
                <th style={{ minWidth: 140 }}>AI Match Score</th>
                <th>AI Synthesis</th>
                <th>Application Status</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.id}>
                  <td>
                    <Link to={`/jobs/${a.job?.id}`} className="accent" style={{ fontWeight: 600 }}>
                      {a.job?.title || "Role"}
                    </Link>
                  </td>
                  <td>{a.job?.recruiter?.company || "TechCorp"}</td>
                  <td className="muted small">{fmtDate(a.appliedAt)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <b>{a.matchScore != null ? `${a.matchScore}%` : "Pending"}</b>
                    </div>
                    {a.matchScore != null && <ProgressBar value={a.matchScore} />}
                  </td>
                  <td style={{ maxWidth: 300, fontSize: "0.85rem" }} className="muted">
                    {a.aiSummary || "Evaluation in progress"}
                  </td>
                  <td>
                    <StatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
