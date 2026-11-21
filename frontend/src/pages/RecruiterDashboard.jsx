import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api, { errMsg } from "../api";
import { Spinner, StatCard, notify } from "../components/UI";
import { StatusPie } from "../components/Views";

export default function RecruiterDashboard() {
  const [d, setD] = useState(null);

  useEffect(() => {
    api
      .get("/api/analytics/recruiter")
      .then((r) => setD(r.data))
      .catch((e) => notify(errMsg(e), "error"));
  }, []);

  if (!d) return <Spinner text="Loading recruitment analytics..." />;

  const appPerJob = Array.isArray(d.applicationsPerJob) ? d.applicationsPerJob : [];
  const topCands = Array.isArray(d.topCandidates) ? d.topCandidates : [];

  return (
    <div className="page-wrap">
      <div className="section-head between">
        <div>
          <span className="eyebrow">Recruitment Command Center</span>
          <h2 className="section-title">Hiring Pipeline Analytics</h2>
          <p className="muted small">Real-time candidate metrics, job volumes, and AI-ranked applicants.</p>
        </div>
        <div className="row">
          <Link to="/recruiter/post" className="btn btn-primary btn-sm">
            + Post Job
          </Link>
          <Link to="/recruiter/jobs" className="btn btn-ghost btn-sm">
            Manage Jobs
          </Link>
        </div>
      </div>

      <div className="stats-bar" style={{ marginBottom: 24 }}>
        <StatCard label="Total Jobs Created" value={d.totalJobs ?? 0} />
        <StatCard label="Open Positions" value={d.openJobs ?? 0} />
        <StatCard label="Received Applications" value={d.totalApplications ?? 0} />
        <StatCard label="Avg. Match Score" value={d.averageMatchScore ?? "0%"} />
      </div>

      <div className="grid2">
        <div className="panel">
          <h3 style={{ marginBottom: 14 }}>Applications per Job</h3>
          {appPerJob.length === 0 ? (
            <div className="empty-box">No jobs posted yet.</div>
          ) : (
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appPerJob}>
                  <XAxis dataKey="title" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      borderColor: "#273449",
                      borderRadius: "10px",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar dataKey="applications" fill="#145CFF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="panel">
          <h3 style={{ marginBottom: 14 }}>Applicant Stage Distribution</h3>
          <StatusPie data={d.statusBreakdown || {}} />
        </div>
      </div>

      <div className="panel" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 14 }}>Top Candidates (AI Compatibility Ranked)</h3>
        {topCands.length === 0 ? (
          <div className="empty-box">No applicants received yet across your active postings.</div>
        ) : (
          <div className="scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Target Job Role</th>
                  <th>AI Match Score</th>
                </tr>
              </thead>
              <tbody>
                {topCands.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <b>{c.candidate}</b>
                    </td>
                    <td>{c.job}</td>
                    <td>
                      <span className="badge OPEN">{c.score}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
