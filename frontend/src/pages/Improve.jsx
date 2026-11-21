import { useEffect, useState } from "react";
import api, { errMsg } from "../api";
import { Spinner, notify } from "../components/UI";
import { ImproveView } from "../components/Views";

export default function Improve() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get("/api/jobs")
      .then((r) => setJobs(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  }, []);

  const run = async () => {
    setBusy(true);
    setRes(null);
    try {
      const { data } = await api.post(
        "/api/ai/improve-resume",
        null,
        { params: jobId ? { jobId } : {} }
      );
      setRes(data);
      notify("Resume enhancement generated!", "success");
    } catch (e) {
      notify(errMsg(e), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">AI Resume Optimizer</span>
          <h2 className="section-title">Resume Improvement Assistant</h2>
          <p className="muted small">
            AI-powered bullet rewrites, high-impact action verbs, ATS keyword recommendations, and tailored enhancements.
          </p>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 760 }}>
        <div className="field">
          <label htmlFor="target-role">Select Target Job (Optional — for tailored keywords & tone)</label>
          <select
            id="target-role"
            className="input"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
          >
            <option value="">General ATS Optimization (All tech roles)</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} · {j.recruiter?.company || "TechCorp"} ({j.location || "Remote"})
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary"
          style={{ marginTop: 16 }}
          disabled={busy}
          onClick={run}
        >
          {busy ? "Optimizing Resume with AI..." : "✨ Generate Resume Improvements"}
        </button>
      </div>

      {busy && (
        <Spinner text="Our AI agent is rewriting bullet points with quantified metrics and matching keywords..." />
      )}

      {res && (
        <div style={{ marginTop: 24 }}>
          <ImproveView r={res} />
        </div>
      )}
    </div>
  );
}
