import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext";
import AuthAside from "../components/AuthAside";
import { notify } from "../components/UI";

export default function Register() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    role: "CANDIDATE",
    company: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/api/auth/register", f);
      const { data } = await api.post("/api/auth/login", {
        email: f.email,
        password: f.password,
      });
      login(data);
      notify(`Account created! Welcome, ${data.name}`, "success");
      nav(data.role === "RECRUITER" ? "/recruiter" : "/candidate");
    } catch (err) {
      const msg = errMsg(err);
      setError(msg);
      notify(msg, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <AuthAside
        heading="Join TalentSphere AI."
        text="Whether you're a high-impact developer looking for the right match, or a recruiter scaling high-performance engineering teams, we've got you covered."
      />
      <div className="auth-main">
        <div className="panel auth-card">
          <h2 className="auth-title">Create Account</h2>
          <p className="muted small">Select your role and start using TalentSphere AI for free.</p>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Role Toggle Selector */}
          <div className="role-toggle-group" style={{ margin: "16px 0" }}>
            <button
              type="button"
              className={`role-btn ${f.role === "CANDIDATE" ? "active" : ""}`}
              onClick={() => setF({ ...f, role: "CANDIDATE" })}
            >
              🎓 I'm a Candidate
            </button>
            <button
              type="button"
              className={`role-btn ${f.role === "RECRUITER" ? "active" : ""}`}
              onClick={() => setF({ ...f, role: "RECRUITER" })}
            >
              💼 I'm a Recruiter
            </button>
          </div>

          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                className="input"
                required
                placeholder="Jane Doe"
                value={f.name}
                onChange={set("name")}
              />
            </div>

            <div className="field">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                className="input"
                type="email"
                required
                placeholder="jane@example.com"
                value={f.email}
                onChange={set("email")}
              />
            </div>

            <div className="field">
              <label htmlFor="reg-pass">Password (minimum 6 characters)</label>
              <input
                id="reg-pass"
                className="input"
                type="password"
                minLength={6}
                required
                placeholder="••••••••"
                value={f.password}
                onChange={set("password")}
              />
            </div>

            {f.role === "RECRUITER" && (
              <div className="field">
                <label htmlFor="reg-company">Company / Organization</label>
                <input
                  id="reg-company"
                  className="input"
                  required
                  placeholder="Acme Corp or TechLab"
                  value={f.company}
                  onChange={set("company")}
                />
              </div>
            )}

            <button
              className="btn btn-primary btn-block"
              disabled={busy}
              type="submit"
              style={{ marginTop: 16 }}
            >
              {busy ? "Creating Account..." : "Create Free Account"}
            </button>
          </form>

          <p className="auth-foot">
            Already registered? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
