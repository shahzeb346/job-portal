import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PageTransition from "./components/PageTransition.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import JobListings from "./pages/JobListings.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import PostJob from "./pages/PostJob.jsx";
import EmployerJobs from "./pages/EmployerJobs.jsx";
import Applicants from "./pages/Applicants.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/jobs" element={<PageTransition><JobListings /></PageTransition>} />
            <Route path="/jobs/:id" element={<PageTransition><JobDetails /></PageTransition>} />

            <Route
              path="/applications"
              element={
                <ProtectedRoute role="seeker">
                  <PageTransition><MyApplications /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/employer/jobs"
              element={
                <ProtectedRoute role="employer">
                  <PageTransition><EmployerJobs /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/jobs/new"
              element={
                <ProtectedRoute role="employer">
                  <PageTransition><PostJob /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/jobs/:jobId/applicants"
              element={
                <ProtectedRoute role="employer">
                  <PageTransition><Applicants /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageTransition><Profile /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
