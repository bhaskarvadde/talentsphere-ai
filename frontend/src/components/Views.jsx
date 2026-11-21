import { useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Chips, List, ScoreGauge, notify } from "./UI";

export function AnalysisView({ a }) {
  if (!a) return null;
  return (
    <div className="panel">
      <div className="row" style={{ alignItems: "center", gap: 24 }}>
        <ScoreGauge value={a.score} label="ATS Score" />
        <div style={{ flex: 1, minWidth: 240 }}>
          <span className="eyebrow">Experience Level: {a.experienceLevel || "Mid-Level"}</span>
          <p style={{ marginTop: 6, lineHeight: 1.6 }}>{a.summary}</p>
        </div>
      </div>

      <div className="divider"></div>

      <div>
        <h4 style={{ marginBottom: 8 }}>Extracted Core Skills:</h4>
        <Chips items={a.extractedSkills || []} color="cyan" />
      </div>

      <div className="grid2" style={{ marginTop: 20 }}>
        <div className="panel glass">
          <h4 style={{ color: "#10B981", marginBottom: 10 }}>✅ Identified Strengths</h4>
          <List items={a.strengths || []} color="green" />
        </div>
        <div className="panel glass">
          <h4 style={{ color: "#F87171", marginBottom: 10 }}>⚠️ Areas for Improvement</h4>
          <List items={a.weaknesses || []} color="red" />
        </div>
      </div>

      {Array.isArray(a.suggestedRoles) && a.suggestedRoles.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ marginBottom: 8 }}>Suggested Matching Roles:</h4>
          <Chips items={a.suggestedRoles} color="indigo" />
        </div>
      )}
    </div>
  );
}

export function MatchView({ m }) {
  if (!m) return null;
  return (
    <div className="panel">
      <div className="row" style={{ alignItems: "center", gap: 24 }}>
        <ScoreGauge value={m.matchScore} label="Job Match" />
        <div style={{ flex: 1, minWidth: 240 }}>
          <span className={`badge ${m.recommendation || "GOOD_FIT"}`}>
            {(m.recommendation || "").replace("_", " ")}
          </span>
          <p style={{ marginTop: 8, lineHeight: 1.6 }}>{m.summary}</p>
        </div>
      </div>

      <div className="grid2" style={{ marginTop: 20 }}>
        <div className="panel glass">
          <h4 style={{ color: "#10B981", marginBottom: 10 }}>🎯 Matched Job Skills</h4>
          <Chips items={m.matchedSkills || []} color="green" />
        </div>
        <div className="panel glass">
          <h4 style={{ color: "#F87171", marginBottom: 10 }}>⚠️ Missing Keywords & Skills</h4>
          <Chips items={m.missingSkills || []} color="red" />
        </div>
      </div>
    </div>
  );
}

export function ImproveView({ r }) {
  if (!r) return null;
  return (
    <div className="panel">
      <div className="row" style={{ alignItems: "center", gap: 24 }}>
        <ScoreGauge value={r.atsScore} label="ATS Target" />
        <div style={{ flex: 1, minWidth: 240 }}>
          <h4 style={{ marginBottom: 6 }}>Enhanced Executive Summary</h4>
          <p className="panel glass muted" style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>
            {r.improvedSummary}
          </p>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginTop: 8 }}
            onClick={() => {
              navigator.clipboard.writeText(r.improvedSummary || "");
              notify("Summary copied to clipboard!", "success");
            }}
          >
            📋 Copy Summary
          </button>
        </div>
      </div>

      <div className="divider"></div>

      <h4 style={{ marginBottom: 14 }}>Bullet Point Enhancements (Before vs After)</h4>
      {(r.bulletRewrites || []).map((b, i) => (
        <div className="ba-card" key={i}>
          <div className="ba-before">
            <span className="ba-label">Before:</span>
            <p>{b.original}</p>
          </div>
          <div className="ba-after">
            <span className="ba-label">After (Impact Optimized):</span>
            <p>{b.improved}</p>
          </div>
        </div>
      ))}

      {Array.isArray(r.missingKeywords) && r.missingKeywords.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ marginBottom: 8 }}>Recommended Keywords to Add:</h4>
          <Chips items={r.missingKeywords} color="red" />
        </div>
      )}

      <div className="grid2" style={{ marginTop: 20 }}>
        <div className="panel glass">
          <h4 style={{ marginBottom: 10 }}>📐 Formatting Recommendations</h4>
          <List items={r.formattingTips || []} />
        </div>
        <div className="panel glass">
          <h4 style={{ marginBottom: 10 }}>🚀 Recommended Action Plan</h4>
          <List items={r.actionPlan || []} />
        </div>
      </div>
    </div>
  );
}

const TABS = [
  ["technical", "Technical"],
  ["behavioral", "Behavioral"],
  ["scenarioBased", "Scenario-Based"],
  ["hr", "HR & Culture"],
];

export function InterviewTabs({ data }) {
  const [tab, setTab] = useState("technical");
  if (!data) return null;
  const items = Array.isArray(data[tab]) ? data[tab] : [];

  return (
    <div>
      <div className="tabs-nav">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            className={`tab-btn ${tab === k ? "active" : ""}`}
            onClick={() => setTab(k)}
          >
            {l} ({Array.isArray(data[k]) ? data[k].length : 0})
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
        {items.length === 0 ? (
          <p className="muted small">No questions in this section.</p>
        ) : (
          items.map((q, i) => (
            <details className="faq-item" key={i}>
              <summary className="faq-question">
                {typeof q === "string" ? q : q.question}
              </summary>
              {q.hint && (
                <div className="faq-hint">
                  💡 <b>Preparation Hint:</b> {q.hint}
                </div>
              )}
            </details>
          ))
        )}
      </div>
    </div>
  );
}

const COLORS = {
  APPLIED: "#6366F1",
  SHORTLISTED: "#F59E0B",
  REJECTED: "#F87171",
  HIRED: "#10B981",
};

export function StatusPie({ data = {} }) {
  const rows = Object.entries(data)
    .filter(([, v]) => Number(v) > 0)
    .map(([name, value]) => ({ name, value: Number(value) }));

  if (!rows.length) {
    return <div className="empty-box">No application stages tracked yet.</div>;
  }

  return (
    <div style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={rows}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            innerRadius={45}
            paddingAngle={4}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          >
            {rows.map((r) => (
              <Cell key={r.name} fill={COLORS[r.name] || "#145CFF"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderColor: "#273449",
              borderRadius: "10px",
              color: "#f8fafc",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
