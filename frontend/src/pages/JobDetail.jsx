import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext";
import { Chips, Spinner, notify, splitSkills } from "../components/UI";
import { InterviewTabs, MatchView } from "../components/Views";

export default function JobDetail() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState(null);
  const [match, setMatch] = useState(null);
  const [qs, setQs] = useState(null);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    api
      .get(`/api/jobs/${id}`)
      .then((r) => setJob(r.data))
      .catch((e) => notify(errMsg(e), "error"));
  }, [id]);

  const requireAuth = (actionName) => {
    if (!isLoggedIn) {
      notify(`Please sign in to ${actionName}`, "info");
      nav("/login", { state: { from: location } });
      return false;
    }
    return true;
  };

  const run = async (key, fn) => {
    setBusy(key);
    try {
      await fn();
    } catch (e) {
      const m = errMsg(e);
      notify(m, "error");
      if (/resume/i.test(m)) {
        setTimeout(() => nav("/candidate/resume"), 1500);
      }
    } finally {
      setBusy("");
    }
  };

  const doMatch = () => {
    if (!requireAuth("analyze your match")) return;
    run("match", async () => {
      const res = await api.get(`/api/ai/match/${id}`);
      setMatch(res.data);
      notify("AI Match calculated!", "success");
    });
  };

  const apply = () => {
    if (!requireAuth("apply for this role")) return;
    run("apply", async () => {
      await api.post(`/api/jobs/${id}/apply`);
      notify("Application submitted successfully!", "success");
    });
  };

  const prep = () => {
    if (!requireAuth("view interview preparation")) return;
    run("prep", async () => {
      const res = await api.get(`/api/ai/interview-questions/${id}`);
      setQs(res.data);
      notify("Interview questions generated!", "success");
    });
  };

  if (!job) return <Spinner text="Loading role details..." />;

  const isCandidate = user?.role === "CANDIDATE";
  const isRecruiter = user?.role === "RECRUITER";
  const isMine = isRecruiter && job.recruiter?.email === user?.email;

  return (
    <div className="page-wrap">
      <Link to="/jobs" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        ← Back to all jobs
      </Link>

      <div className="panel" style={{ padding: 28 }}>
        <div className="row between" style={{ alignItems: "flex-start" }}>
          <div>
            <span className="eyebrow">{job.recruiter?.company || "Hiring Company"}</span>
            <h1 className="hero-title" style={{ fontSize: "2rem", marginTop: 4 }}>
              {job.title}
            </h1>
            <p className="muted small" style={{ marginTop: 6 }}>
              📍 {job.location || "Remote"} · ⏱ {job.experienceRequired ?? 0}+ years experience · 💰 {job.salaryRange || "Competitive compensation"}
            </p>
          </div>
          <span className={`badge ${job.status}`}>{job.status}</span>
        </div>

        <div style={{ margin: "20px 0" }}>
          <h4 style={{ marginBottom: 8, fontSize: "0.95rem" }}>Required Skills & Tech Stack:</h4>
          <Chips items={splitSkills(job.requiredSkills)} />
        </div>

        <div className="divider"></div>

        <div>
          <h4 style={{ marginBottom: 10 }}>Role Description:</h4>
          <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }} className="muted">
            {job.description}
          </p>
        </div>

        <div className="divider"></div>

        <div className="row" style={{ marginTop: 20 }}>
          {(!user || isCandidate) && (
            <>
              <button
                className="btn btn-primary"
                disabled={!!busy || job.status !== "OPEN"}
                onClick={apply}
              >
                {busy === "apply" ? "Submitting Application..." : "Apply Now"}
              </button>
              <button
                className="btn btn-ghost"
                disabled={!!busy}
                onClick={doMatch}
              >
                {busy === "match" ? "Analyzing Match..." : "✨ Check AI Match"}
              </button>
              <button
                className="btn btn-ghost"
                disabled={!!busy}
                onClick={prep}
              >
                {busy === "prep" ? "Generating Questions..." : "🎯 Interview Prep Q&A"}
              </button>
            </>
          )}

          {isMine && (
            <Link className="btn btn-primary" to={`/recruiter/jobs/${job.id}/applicants`}>
              View Job Applicants
            </Link>
          )}
        </div>
      </div>

      {busy && busy !== "apply" && (
        <Spinner text="TalentSphere AI is analyzing your profile... this takes about 5-10 seconds." />
      )}

      {match && (
        <div style={{ marginTop: 24 }}>
          <MatchView m={match} />
        </div>
      )}

      {qs && (
        <div className="panel" style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 16 }}>🎯 Tailored Interview Preparation</h3>
          <InterviewTabs data={qs} />
        </div>
      )}
    </div>
  );
}
