import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errMsg } from "../api";
import { Chips, ProgressBar, Spinner, notify, splitSkills } from "../components/UI";
import { InterviewTabs } from "../components/Views";

const STATUSES = ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"];

export default function Applicants() {
  const { id } = useParams();
  const [apps, setApps] = useState(null);
  const [job, setJob] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.get(`/api/jobs/${id}/applications`),
      api.get(`/api/jobs/${id}`),
    ])
      .then(([a, j]) => {
        if (active) {
          setApps(Array.isArray(a.data) ? a.data : []);
          setJob(j.data);
        }
      })
      .catch((e) => {
        if (active) {
          notify(errMsg(e), "error");
          setApps([]);
        }
      });
    return () => {
      active = false;
    };
  }, [id]);

  const refreshData = async () => {
    try {
      const [a, j] = await Promise.all([
        api.get(`/api/jobs/${id}/applications`),
        api.get(`/api/jobs/${id}`),
      ]);
      setApps(Array.isArray(a.data) ? a.data : []);
      setJob(j.data);
    } catch (e) {
      notify(errMsg(e), "error");
    }
  };

  const setStatus = async (appId, status) => {
    try {
      await api.put(`/api/applications/${appId}/status`, { status });
      notify("Applicant status updated successfully", "success");
      refreshData();
    } catch (e) {
      notify(errMsg(e), "error");
    }
  };

  const openQuestions = async (a) => {
    const candidateName = a.candidate?.user?.name || "Candidate";
    setModal({ name: candidateName, data: null });
    try {
      const { data } = await api.get(`/api/ai/interview-questions/${id}`, {
        params: a.candidate?.id ? { candidateId: a.candidate.id } : {},
      });
      setModal({ name: candidateName, data });
    } catch (e) {
      notify(errMsg(e), "error");
      setModal(null);
    }
  };

  if (!apps) return <Spinner text="Loading candidate applications..." />;

  return (
    <div className="page-wrap">
      <Link to="/recruiter/jobs" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
        ← Back to My Jobs
      </Link>

      <div className="section-head">
        <div>
          <span className="eyebrow">Applicant Evaluation</span>
          <h2 className="section-title">
            Applicants{job ? `: ${job.title}` : ""}
          </h2>
          <p className="muted small">
            Ranked dynamically by AI match score (highest compatibility first).
          </p>
        </div>
      </div>

      {apps.length === 0 ? (
        <div className="panel empty-box">
          <h3>No applications received yet</h3>
          <p className="muted small">As candidates apply, their resumes will be automatically parsed and ranked here.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {apps.map((a) => (
            <div className="panel" key={a.id}>
              <div className="row between" style={{ alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontSize: "1.2rem" }}>
                    {a.candidate?.user?.name || "Candidate"}
                  </h3>
                  <span className="muted small">
                    ✉️ {a.candidate?.user?.email || "No email"} · ⏱ {a.candidate?.experienceYears ?? 0} yrs experience · 📍 {a.candidate?.location || "Not specified"}
                  </span>
                </div>
                <div style={{ minWidth: 160, textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                    <span className="muted small">AI Match:</span>
                    <b className="accent" style={{ fontSize: "1.1rem" }}>
                      {a.matchScore != null ? `${a.matchScore}%` : "N/A"}
                    </b>
                  </div>
                  {a.matchScore != null && <ProgressBar value={a.matchScore} />}
                </div>
              </div>

              {a.candidate?.skills && (
                <div style={{ margin: "12px 0 8px" }}>
                  <Chips items={splitSkills(a.candidate.skills).slice(0, 8)} />
                </div>
              )}

              {a.aiSummary && (
                <p className="panel glass muted small" style={{ margin: "12px 0", lineHeight: 1.6 }}>
                  🤖 <b>AI Summary:</b> {a.aiSummary}
                </p>
              )}

              <div className="row between" style={{ marginTop: 14 }}>
                <div className="row" style={{ gap: 10 }}>
                  <span className="muted small" style={{ fontWeight: 600 }}>Update Stage:</span>
                  <select
                    className="input"
                    style={{ width: 170, padding: "6px 10px" }}
                    value={a.status}
                    onChange={(e) => setStatus(a.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => openQuestions(a)}
                >
                  🎯 Generate Tailored Interview Q&A
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Tailored Interview Questions */}
      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="row between" style={{ marginBottom: 14 }}>
              <h3>Interview Questions for {modal.name}</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setModal(null)}
              >
                ✕ Close
              </button>
            </div>
            {modal.data ? (
              <InterviewTabs data={modal.data} />
            ) : (
              <Spinner text="Synthesizing candidate profile against job requirements..." />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
