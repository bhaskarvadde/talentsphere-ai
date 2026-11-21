import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "../AuthContext";
import { Chips, Spinner, notify, splitSkills } from "../components/UI";

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState(null);
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get("/api/jobs")
      .then((res) => {
        if (active) {
          setJobs(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((e) => {
        if (active) {
          notify(errMsg(e), "error");
          setJobs([]);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault();
    setSearching(true);
    try {
      const { data } = await api.get("/api/jobs", { params: q ? { q } : {} });
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      notify(errMsg(err), "error");
      setJobs([]);
    } finally {
      setSearching(false);
    }
  };

  const handleClear = async () => {
    setQ("");
    setSearching(true);
    try {
      const { data } = await api.get("/api/jobs");
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      notify(errMsg(err), "error");
      setJobs([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="section-head between">
        <div>
          <span className="eyebrow">Explore Careers</span>
          <h2 className="section-title">Open Job Positions</h2>
          <p className="muted small">Browse tech opportunities and evaluate your resume compatibility with AI.</p>
        </div>
        {user?.role === "RECRUITER" && (
          <Link to="/recruiter/post" className="btn btn-primary btn-sm">
            + Post New Job
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <form className="search-bar panel" onSubmit={handleSearch}>
        <input
          className="input search-input"
          placeholder="Search by job title, skill (e.g. Java, Python, React), or location..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={searching}>
          {searching ? "Searching..." : "Search Jobs"}
        </button>
        {q && (
          <button type="button" className="btn btn-ghost" onClick={handleClear}>
            Clear
          </button>
        )}
      </form>

      {!jobs ? (
        <Spinner text="Loading open roles..." />
      ) : jobs.length === 0 ? (
        <div className="panel empty-box">
          <h3>No matching jobs found</h3>
          <p className="muted small">Try refining your search keyword or check back later.</p>
        </div>
      ) : (
        <div className="grid">
          {jobs.map((j) => (
            <div className="panel job-card" key={j.id}>
              <div className="row between">
                <h3 className="job-title">{j.title}</h3>
                <span className={`badge ${j.status}`}>{j.status}</span>
              </div>
              <p className="muted small">
                {j.recruiter?.company || "TechCorp"} · {j.location || "Remote"}
              </p>
              <div style={{ margin: "10px 0" }}>
                <Chips items={splitSkills(j.requiredSkills).slice(0, 6)} />
              </div>
              <p className="muted small">
                <b>{j.experienceRequired ?? 0}+ yrs</b> exp · {j.salaryRange || "Competitive"}
              </p>
              <div style={{ marginTop: 16 }}>
                <Link className="btn btn-primary btn-sm btn-block" to={`/jobs/${j.id}`}>
                  View Details & Match
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
