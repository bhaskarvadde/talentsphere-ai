import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/UI";
import Applicants from "./pages/Applicants";
import CandidateDashboard from "./pages/CandidateDashboard";
import Home from "./pages/Home";
import Improve from "./pages/Improve";
import JobDetail from "./pages/JobDetail";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import MyApplications from "./pages/MyApplications";
import MyJobs from "./pages/MyJobs";
import PostJob from "./pages/PostJob";
import Profile from "./pages/Profile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import Register from "./pages/Register";
import Resume from "./pages/Resume";

export default function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <Toaster />
      <main className="main-content">
        <div className="container">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Candidate Protected Routes */}
            <Route
              path="/candidate"
              element={
                <ProtectedRoute role="CANDIDATE">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/profile"
              element={
                <ProtectedRoute role="CANDIDATE">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/resume"
              element={
                <ProtectedRoute role="CANDIDATE">
                  <Resume />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/improve"
              element={
                <ProtectedRoute role="CANDIDATE">
                  <Improve />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/applications"
              element={
                <ProtectedRoute role="CANDIDATE">
                  <MyApplications />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Protected Routes */}
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute role="RECRUITER">
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/post"
              element={
                <ProtectedRoute role="RECRUITER">
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs"
              element={
                <ProtectedRoute role="RECRUITER">
                  <MyJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id/applicants"
              element={
                <ProtectedRoute role="RECRUITER">
                  <Applicants />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}
