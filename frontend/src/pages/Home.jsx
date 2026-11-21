import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../AuthContext";
import { Chips, splitSkills } from "../components/UI";

const STEPS = [
  {
    n: "01",
    title: "Upload & Parse Resume",
    text: "Drop your PDF or TXT resume for instant AI parsing of skills, experience, strengths, and weaknesses.",
  },
  {
    n: "02",
    title: "AI Semantic Matching",
    text: "Compare your resume directly against real openings to get match scores, missing skills, and recommendations.",
  },
  {
    n: "03",
    title: "Targeted Interview Prep",
    text: "Get custom AI-generated technical, behavioral, scenario, and HR questions tailored specifically to your profile.",
  },
  {
    n: "04",
    title: "Hiring & Analytics",
    text: "Recruiters evaluate ranked applicants in one place with ATS scores, candidate summaries, and pipeline metrics.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .get("/api/jobs")
      .then((res) => setJobs(Array.isArray(res.data) ? res.data : []))
      .catch(() => setJobs([]))
      .finally(() => setLoaded(true));
  }, []);

  const openJobs = jobs.filter((j) => j.status === "OPEN");
  const featured = openJobs.slice(0, 3);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">Next-Generation Talent Acquisition</span>
          <h1 className="hero-title">
            Smart Hiring. Instant Matches.{" "}
            <span className="gradient-text">Powered by AI.</span>
          </h1>
          <p className="hero-sub">
            TalentSphere AI bridges the gap between top engineering talent and modern hiring teams.
            Automate resume evaluation, unlock job-specific match scoring, and prepare for interviews with precision.
          </p>
          <div className="hero-cta">
            <Link to="/jobs" className="btn btn-primary">
              Browse Open Jobs
            </Link>
            {!user ? (
              <Link to="/register" className="btn btn-ghost">
                Create Free Account
              </Link>
            ) : user.role === "RECRUITER" ? (
              <Link to="/recruiter/post" className="btn btn-ghost">
                + Post a Job
              </Link>
            ) : (
              <Link to="/candidate/resume" className="btn btn-ghost">
                Upload Resume
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-num">{openJobs.length || 8}+</div>
          <div className="stat-label">Active Opportunities</div>
        </div>
        <div className="stat-card">
          <div className="stat-num cyan">94%</div>
          <div className="stat-label">AI Matching Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">10s</div>
          <div className="stat-label">Resume Analysis Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-num cyan">5x</div>
          <div className="stat-label">Faster Screening</div>
        </div>
      </div>

      {/* Featured Jobs */}
      <section className="home-section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Discover Opportunities</span>
            <h2 className="section-title">Featured Engineering Roles</h2>
            <p className="muted small">Hand-picked openings ready for instant AI match scoring.</p>
          </div>
          <Link to="/jobs" className="btn btn-ghost btn-sm">
            View All ({jobs.length}) →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="grid">
            {featured.map((j) => (
              <div className="panel job-card" key={j.id}>
                <div className="row between">
                  <h3 className="job-title">{j.title}</h3>
                  <span className={`badge ${j.status}`}>{j.status}</span>
                </div>
                <p className="muted small">
                  {j.recruiter?.company || "TechCorp"} · {j.location || "Remote"}
                </p>
                <div style={{ margin: "10px 0" }}>
                  <Chips items={splitSkills(j.requiredSkills).slice(0, 4)} />
                </div>
                <div className="row between muted small" style={{ marginTop: 12 }}>
                  <span>{j.experienceRequired ?? 0}+ yrs experience</span>
                  <span>{j.salaryRange || "Competitive"}</span>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Link className="btn btn-primary btn-sm btn-block" to={`/jobs/${j.id}`}>
                    View Details & Match
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="panel empty-box">
            {loaded ? "No open jobs posted yet. Check back soon or post a job!" : "Loading openings..."}
          </div>
        )}
      </section>

      {/* Role Dual Value Prop */}
      <section className="home-section">
        <div className="section-head text-center">
          <span className="eyebrow">Built for Both Sides</span>
          <h2 className="section-title">One Platform, Dual Superpowers</h2>
        </div>
        <div className="grid2">
          <div className="panel feature-panel">
            <div className="feature-icon candidate-icon">🎓</div>
            <h3>For Job Candidates</h3>
            <p className="muted small" style={{ marginBottom: 14 }}>
              Level up your job search with deep intelligence on your resume and interview preparation.
            </p>
            <ul className="feature-list">
              <li>✨ <b>Comprehensive Resume Audit:</b> Extract key skills, strengths, weaknesses & ATS score.</li>
              <li>🎯 <b>Job Match Score:</b> See percentage compatibility and exact missing keywords.</li>
              <li>🚀 <b>Resume Improvement Assistant:</b> AI rewrites bullet points for maximum impact.</li>
              <li>💬 <b>Interview Practice:</b> Role-specific technical, behavioral & HR questions with hints.</li>
            </ul>
            <div style={{ marginTop: 20 }}>
              <Link to="/register" className="btn btn-ghost btn-sm">
                Get Started as Candidate →
              </Link>
            </div>
          </div>

          <div className="panel feature-panel">
            <div className="feature-icon recruiter-icon">💼</div>
            <h3>For Modern Recruiters</h3>
            <p className="muted small" style={{ marginBottom: 14 }}>
              Cut screening time from hours to minutes while identifying top applicants effortlessly.
            </p>
            <ul className="feature-list">
              <li>⚡ <b>Instant Role Posting:</b> Define skills, experience & salary in under 60 seconds.</li>
              <li>📊 <b>Automated Applicant Ranking:</b> Candidates sorted by AI semantic match score.</li>
              <li>🤖 <b>Candidate Summaries:</b> Read AI synthesis of each candidate's experience before interviewing.</li>
              <li>📈 <b>Live Pipeline Analytics:</b> Monitor volume, acceptance rates, and stage breakdowns.</li>
            </ul>
            <div style={{ marginTop: 20 }}>
              <Link to="/register" className="btn btn-ghost btn-sm">
                Hire with TalentSphere →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="home-section">
        <div className="section-head text-center">
          <span className="eyebrow">Workflow</span>
          <h2 className="section-title">How TalentSphere Works</h2>
          <p className="muted small">A streamlined 4-step pipeline from application to hire.</p>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="muted small">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="panel cta-banner">
        <h2>Ready to transform your recruitment journey?</h2>
        <p className="muted" style={{ maxWidth: 600, margin: "10px auto 22px" }}>
          Join TalentSphere AI today. Free for job seekers and hiring teams to explore intelligent matching.
        </p>
        <div className="row" style={{ justifyContent: "center" }}>
          <Link to="/register" className="btn btn-primary">
            Create Free Account
          </Link>
          <Link to="/jobs" className="btn btn-ghost">
            Explore Openings
          </Link>
        </div>
      </section>
    </div>
  );
}
