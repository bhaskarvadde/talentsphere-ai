export default function AuthAside({ heading, text }) {
  return (
    <aside className="auth-aside">
      <div className="logo-badge">
        <span className="logo-mark"></span>
        <span className="logo-text">
          TALENTSPHERE <span className="accent">AI</span>
        </span>
      </div>
      <span className="eyebrow">Next-Gen Recruitment</span>
      <h2>{heading}</h2>
      <p>{text}</p>
      <ul className="auth-points">
        <li>⚡ Instant AI resume parsing & deep ATS scoring</li>
        <li>🎯 Intelligent job match scoring & skill gap analysis</li>
        <li>🤖 Automated role-specific interview preparation</li>
        <li>📊 Unified hiring pipeline analytics for recruiters</li>
      </ul>
    </aside>
  );
}
