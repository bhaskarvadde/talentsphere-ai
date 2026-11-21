import { useEffect, useState } from "react";

export const notify = (msg, type = "info") =>
  window.dispatchEvent(new CustomEvent("toast", { detail: { msg, type } }));

export function Toaster() {
  const [t, setT] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setT(e.detail);
      setTimeout(() => setT(null), 4000);
    };
    window.addEventListener("toast", handler);
    return () => window.removeEventListener("toast", handler);
  }, []);

  if (!t) return null;
  return <div className={`toast toast-${t.type}`}>{t.msg}</div>;
}

export const Spinner = ({ text = "Loading..." }) => (
  <div className="spinner-wrap">
    <div className="spinner" />
    <span>{text}</span>
  </div>
);

export const scoreColor = (v) => {
  const num = Number(v) || 0;
  if (num >= 75) return "#10B981"; // Emerald
  if (num >= 50) return "#F59E0B"; // Amber
  return "#F87171"; // Red
};

export function ScoreGauge({ value = 0, label = "Score", size = 130 }) {
  const r = 44;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const strokeColor = scoreColor(v);

  return (
    <div className="gauge-wrap" style={{ width: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#273449"
          strokeWidth="9"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${(v / 100) * c} ${c}`}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill="#F8FAFC"
          className="num"
        >
          {v}%
        </text>
      </svg>
      <span className="muted small" style={{ fontWeight: 600 }}>{label}</span>
    </div>
  );
}

export const Chips = ({ items = [], color = "" }) => (
  <div className="chips">
    {(Array.isArray(items) ? items : []).map((s, i) => (
      <span key={i} className={`chip ${color}`}>
        {s}
      </span>
    ))}
  </div>
);

export const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <div className="stat-num">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export const StatusBadge = ({ status }) => (
  <span className={`badge ${status || "APPLIED"}`}>{status}</span>
);

export const ProgressBar = ({ value = 0 }) => {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="progress-bar-bg">
      <div
        className="progress-bar-fill"
        style={{ width: `${v}%`, backgroundColor: scoreColor(v) }}
      />
    </div>
  );
};

export const List = ({ items = [], color = "" }) => (
  <ul className={`feature-list ${color}`}>
    {(Array.isArray(items) ? items : []).map((s, i) => (
      <li key={i}>{s}</li>
    ))}
  </ul>
);

export const splitSkills = (s) =>
  (s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

export const fmtDate = (d) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return String(d);
  }
};
