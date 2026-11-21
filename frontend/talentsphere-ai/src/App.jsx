
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserRegister from "./UserRegister.jsx";
import CandidateRegister from "./CandidateRegister.jsx";
import Jobs from "./Jobs.jsx";
import Applications from "./Applications.jsx";
import ResumeAnalysis from "./ResumeAnalysis.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserRegister />} />
        <Route path="/candidate" element={<CandidateRegister />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/resume-analysis" element={<ResumeAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
