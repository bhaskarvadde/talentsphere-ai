import { useEffect, useRef, useState } from "react";
import api, { errMsg } from "../api";
import { Spinner, fmtDate, notify } from "../components/UI";
import { AnalysisView } from "../components/Views";

export default function Resume() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  useEffect(() => {
    let active = true;
    api
      .get("/api/candidate/analyses")
      .then(({ data }) => {
        if (active) {
          const list = Array.isArray(data) ? data : [];
          setHistory(list);
          const last = list.find((h) => h.type === "RESUME_ANALYSIS");
          if (last && last.content) {
            try {
              const parsed = JSON.parse(last.content);
              setAnalysis((cur) => cur || parsed);
            } catch {
              // ignore
            }
          }
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const loadHistory = async () => {
    try {
      const { data } = await api.get("/api/candidate/analyses");
      const list = Array.isArray(data) ? data : [];
      setHistory(list);
      const last = list.find((h) => h.type === "RESUME_ANALYSIS");
      if (last && last.content) {
        try {
          const parsed = JSON.parse(last.content);
          setAnalysis((cur) => cur || parsed);
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }
  };

  const upload = async () => {
    if (!file) return notify("Please select a resume file first (.pdf or .txt)", "error");
    const fd = new FormData();
    fd.append("file", file);
    setBusy("upload");
    try {
      const { data } = await api.post("/api/candidate/resume", fd);
      setAnalysis(data);
      notify("Resume uploaded and analyzed successfully!", "success");
      loadHistory();
    } catch (e) {
      notify(errMsg(e), "error");
    } finally {
      setBusy("");
    }
  };

  const reanalyze = async () => {
    setBusy("re");
    try {
      const { data } = await api.post("/api/ai/analyze-resume");
      setAnalysis(data);
      notify("Resume re-analysis complete!", "success");
      loadHistory();
    } catch (e) {
      notify(errMsg(e), "error");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="page-wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">AI Resume Intelligence</span>
          <h2 className="section-title">My Resume & ATS Score</h2>
          <p className="muted small">
            Upload your resume for deep extraction of core skills, experience level, strengths, and weaknesses.
          </p>
        </div>
      </div>

      <div className="panel">
        <div
          className={`drop-zone ${drag ? "drag-over" : ""}`}
          onClick={() => ref.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (e.dataTransfer.files?.[0]) {
              setFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <input
            ref={ref}
            type="file"
            accept=".pdf,.txt"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="drop-icon">📄</div>
          {file ? (
            <div>
              <b className="accent" style={{ fontSize: "1.1rem" }}>{file.name}</b>
              <p className="muted small" style={{ marginTop: 4 }}>
                {(file.size / 1024 / 1024).toFixed(2)} MB · Ready to upload
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontWeight: 600 }}>Drag & drop your resume here, or click to browse</p>
              <p className="muted small" style={{ marginTop: 4 }}>
                Supports PDF or TXT formats (Max 5MB)
              </p>
            </div>
          )}
        </div>

        <div className="row" style={{ marginTop: 18 }}>
          <button
            className="btn btn-primary"
            disabled={!file || !!busy}
            onClick={upload}
          >
            {busy === "upload" ? "Uploading & Auditing..." : "Upload & Analyze Resume"}
          </button>
          {analysis && (
            <button
              className="btn btn-ghost"
              disabled={!!busy}
              onClick={reanalyze}
            >
              {busy === "re" ? "Auditing with AI..." : "Re-Analyze Existing Resume"}
            </button>
          )}
        </div>
      </div>

      {busy && (
        <Spinner text="Our neural parser is extracting your experience and scoring ATS readiness..." />
      )}

      {analysis && (
        <div style={{ marginTop: 24 }}>
          <AnalysisView a={analysis} />
        </div>
      )}

      {history.length > 0 && (
        <div className="panel" style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 14 }}>AI Activity & Analysis History</h3>
          <div className="scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Analysis Type</th>
                  <th>Score</th>
                  <th>Target Role</th>
                  <th>Processed Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <span className="badge">{h.type.replaceAll("_", " ")}</span>
                    </td>
                    <td>
                      <b>{h.score ? `${h.score}%` : "-"}</b>
                    </td>
                    <td>{h.job?.title || "General Audit"}</td>
                    <td className="muted small">{fmtDate(h.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
