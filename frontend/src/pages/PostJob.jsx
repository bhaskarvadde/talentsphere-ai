import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api";
import { notify } from "../components/UI";

export default function PostJob() {
  const nav = useNavigate();
  const [f, setF] = useState({
    title: "",
    description: "",
    requiredSkills: "",
    location: "",
    experienceRequired: "",
    salaryRange: "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/api/jobs", {
        ...f,
        experienceRequired: f.experienceRequired === "" ? null : Number(f.experienceRequired),
      });
      notify("New job position created and published!", "success");
      nav("/recruiter/jobs");
    } catch (err) {
      notify(errMsg(err), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="section-head between">
        <div>
          <span className="eyebrow">Recruitment Management</span>
          <h2 className="section-title">Post a New Job Opening</h2>
          <p className="muted small">Define your technical requirements and let AI match top candidate resumes.</p>
        </div>
        <Link to="/recruiter/jobs" className="btn btn-ghost btn-sm">
          ← Back to My Jobs
        </Link>
      </div>

      <div className="panel" style={{ maxWidth: 760 }}>
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="j-title">Job Title *</label>
            <input
              id="j-title"
              className="input"
              required
              placeholder="e.g. Senior Full-Stack Engineer"
              value={f.title}
              onChange={set("title")}
            />
          </div>

          <div className="field">
            <label htmlFor="j-desc">Role Description & Responsibilities *</label>
            <textarea
              id="j-desc"
              className="input"
              rows={6}
              required
              placeholder="Outline the day-to-day work, team structure, tech stack, and expectations..."
              value={f.description}
              onChange={set("description")}
            />
          </div>

          <div className="field">
            <label htmlFor="j-skills">Required Skills & Keywords (comma separated)</label>
            <input
              id="j-skills"
              className="input"
              placeholder="Java, Spring Boot, React, AWS, Microservices, SQL"
              value={f.requiredSkills}
              onChange={set("requiredSkills")}
            />
          </div>

          <div className="grid2">
            <div className="field">
              <label htmlFor="j-loc">Location</label>
              <input
                id="j-loc"
                className="input"
                placeholder="e.g. New York, NY / Hybrid / Remote"
                value={f.location}
                onChange={set("location")}
              />
            </div>
            <div className="field">
              <label htmlFor="j-exp">Minimum Experience (Years)</label>
              <input
                id="j-exp"
                className="input"
                type="number"
                min="0"
                placeholder="3"
                value={f.experienceRequired}
                onChange={set("experienceRequired")}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="j-sal">Estimated Compensation / Salary Range</label>
            <input
              id="j-sal"
              className="input"
              placeholder="e.g. $120,000 - $150,000 or 15-20 LPA"
              value={f.salaryRange}
              onChange={set("salaryRange")}
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={busy}
            style={{ marginTop: 16 }}
          >
            {busy ? "Publishing Job..." : "Publish Job Opening"}
          </button>
        </form>
      </div>
    </div>
  );
}
