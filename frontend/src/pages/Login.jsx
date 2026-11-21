import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext";
import AuthAside from "../components/AuthAside";
import { notify } from "../components/UI";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [f, setF] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/api/auth/login", f);
      login(data);
      notify(`Welcome back, ${data.name}!`, "success");
      const from = location.state?.from?.pathname;
      if (from) {
        nav(from, { replace: true });
      } else {
        nav(data.role === "RECRUITER" ? "/recruiter" : "/candidate");
      }
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
        heading="Welcome Back to TalentSphere."
        text="Sign in to access your AI resume insights, evaluate candidates, and track hiring pipelines in real time."
      />
      <div className="auth-main">
        <div className="panel auth-card">
          <h2 className="auth-title">Sign In</h2>
          <p className="muted small">Enter your credentials to continue to your portal.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit} style={{ marginTop: 18 }}>
            <div className="field">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                className="input"
                type="email"
                required
                placeholder="you@example.com"
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                className="input"
                type="password"
                required
                placeholder="••••••••"
                value={f.password}
                onChange={(e) => setF({ ...f, password: e.target.value })}
              />
            </div>

            <button
              className="btn btn-primary btn-block"
              disabled={busy}
              type="submit"
              style={{ marginTop: 14 }}
            >
              {busy ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="auth-foot">
            New to TalentSphere? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
