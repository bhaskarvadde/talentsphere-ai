import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand-wrap">
          <div className="logo">
            <span className="logo-mark"></span>
            <span>
              TALENTSPHERE <span className="accent">AI</span>
            </span>
          </div>
          <p className="muted small" style={{ marginTop: 8 }}>
            AI-powered recruitment system with ATS scoring, job matching, and interview intelligence.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">Browse Jobs</Link>
          {user?.role === "CANDIDATE" && (
            <>
              <Link to="/candidate">Candidate Dashboard</Link>
              <Link to="/candidate/resume">My Resume</Link>
              <Link to="/candidate/improve">Improve Resume</Link>
            </>
          )}
          {user?.role === "RECRUITER" && (
            <>
              <Link to="/recruiter">Recruiter Analytics</Link>
              <Link to="/recruiter/post">Post Job</Link>
              <Link to="/recruiter/jobs">My Jobs</Link>
            </>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container muted small">
          © {new Date().getFullYear()} <span className="accent">TalentSphere AI</span> · Engineered with Spring Boot, MySQL, and React
        </div>
      </div>
    </footer>
  );
}
