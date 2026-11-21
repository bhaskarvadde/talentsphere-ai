import { useEffect, useState } from "react";
import api, { errMsg } from "../api";
import { Spinner, notify } from "../components/UI";

export default function Profile() {
  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get("/api/candidate/me")
      .then((r) =>
        setF({
          phone: r.data?.phone || "",
          skills: r.data?.skills || "",
          experienceYears: r.data?.experienceYears ?? "",
          education: r.data?.education || "",
          location: r.data?.location || "",
        })
      )
      .catch((e) => notify(errMsg(e), "error"));
  }, []);

  if (!f) return <Spinner text="Loading your candidate profile..." />;

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.put("/api/candidate/me", {
        ...f,
        experienceYears: f.experienceYears === "" ? null : Number(f.experienceYears),
      });
      notify("Profile details saved successfully!", "success");
    } catch (err) {
      notify(errMsg(err), "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">Candidate Settings</span>
          <h2 className="section-title">My Candidate Profile</h2>
          <p className="muted small">Keep your contact details, education, and skills current for recruiters.</p>
        </div>
      </div>

      <div className="panel" style={{ maxWidth: 680 }}>
        <form onSubmit={save}>
          <div className="field">
            <label htmlFor="p-phone">Phone Number</label>
            <input
              id="p-phone"
              className="input"
              placeholder="+1 (555) 000-0000"
              value={f.phone}
              onChange={set("phone")}
            />
          </div>

          <div className="field">
            <label htmlFor="p-skills">Core Technical Skills (comma separated)</label>
            <textarea
              id="p-skills"
              className="input"
              rows={3}
              placeholder="Java, Spring Boot, React, MySQL, Docker, Kubernetes"
              value={f.skills}
              onChange={set("skills")}
            />
          </div>

          <div className="grid2">
            <div className="field">
              <label htmlFor="p-exp">Years of Experience</label>
              <input
                id="p-exp"
                className="input"
                type="number"
                min="0"
                placeholder="3"
                value={f.experienceYears}
                onChange={set("experienceYears")}
              />
            </div>
            <div className="field">
              <label htmlFor="p-loc">Preferred / Current Location</label>
              <input
                id="p-loc"
                className="input"
                placeholder="San Francisco, CA or Remote"
                value={f.location}
                onChange={set("location")}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="p-edu">Highest Degree & Institution</label>
            <input
              id="p-edu"
              className="input"
              placeholder="B.Tech Computer Science, University"
              value={f.education}
              onChange={set("education")}
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={busy}
            style={{ marginTop: 14 }}
          >
            {busy ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
