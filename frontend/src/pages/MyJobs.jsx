import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api";
import { Chips, Spinner, fmtDate, notify, splitSkills } from "../components/UI";

export default function MyJobs() {
  const [jobs, setJobs] = useState(null);
  const [counts, setCounts] = useState({});

  const refreshData = async () => {
    try {
      const [j, a] = await Promise.all([
        api.get("/api/jobs/mine"),
        api.get("/api/analytics/recruiter"),
      ]);
      setJobs(Array.isArray(j.data) ? j.data : []);
      const appList = a.data?.applicationsPerJob || [];
      setCounts(Object.fromEntries(appList.map((x) => [x.jobId, x.applications])));
    } catch (e) {
      notify(errMsg(e), "error");
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get("/api/jobs/mine"),
      api.get("/api/analytics/recruiter"),
    ])
      .then(([j, a]) => {
        if (active) {
          setJobs(Array.isArray(j.data) ? j.data : []);
          const appList = a.data?.applicationsPerJob || [];
          setCounts(Object.fromEntries(appList.map((x) => [x.jobId, x.applications])));
        }
      })
      .catch((e) => {
        if (active) {
          notify(errMsg(e), "error");
          setJobs([]);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const toggle = async (j) => {
    try {
      const nextStatus = j.status === "OPEN" ? "CLOSED" : "OPEN";
      await api.put(`/api/jobs/${j.id}/status`, null, {
        params: { status: nextStatus },
      });
      notify(`Job marked as ${nextStatus}`, "success");
      refreshData();
    } catch (e) {
      notify(errMsg(e), "error");
    }
  };

  if (!jobs) return <Spinner text="Loading your published roles..." />;

  return (
    <div className="page-wrap">
      <div className="section-head between">
        <div>
          <span className="eyebrow">Recruiter Dashboard</span>
          <h2 className="section-title">My Posted Jobs</h2>
          <p className="muted small">Manage role statuses and review AI-evaluated candidate pools.</p>
        </div>
        <Link className="btn btn-primary btn-sm" to="/recruiter/post">
          + Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="panel empty-box">
          <h3>No jobs published yet</h3>
          <p className="muted small" style={{ marginBottom: 16 }}>
            Create your first job listing to start receiving AI-matched applications.
          </p>
          <Link className="btn btn-primary" to="/recruiter/post">
            + Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="grid">
          {jobs.map((j) => (
            <div className="panel job-card" key={j.id}>
              <div className="row between">
                <h3 className="job-title">{j.title}</h3>
                <span className={`badge ${j.status}`}>{j.status}</span>
              </div>
              <p className="muted small">
                {j.location || "Remote"} · Posted {fmtDate(j.createdAt)}
              </p>
              <div style={{ margin: "10px 0" }}>
                <Chips items={splitSkills(j.requiredSkills).slice(0, 5)} />
              </div>
              <p style={{ marginTop: 8 }}>
                <b className="accent">{counts[j.id] ?? 0}</b> total applicants
              </p>
              <div className="row" style={{ marginTop: 16 }}>
                <Link
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  to={`/recruiter/jobs/${j.id}/applicants`}
                >
                  View Applicants
                </Link>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => toggle(j)}
                >
                  {j.status === "OPEN" ? "Close Job" : "Re-open"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
