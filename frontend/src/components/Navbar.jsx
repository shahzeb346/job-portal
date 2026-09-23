import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseBusiness, Menu, X, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import UserAvatar from "./UserAvatar.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <nav className="container-page flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <BriefcaseBusiness size={18} />
          </div>
          <div>
            <span className="font-display text-xl font-semibold tracking-tight text-slate-900">Fieldnote</span>
          </div>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link to="/jobs" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
            Jobs
          </Link>

          {user?.role === "employer" && (
            <>
              <Link to="/employer/jobs" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
                My postings
              </Link>
              <Link to="/employer/jobs/new" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
                Post a job
              </Link>
            </>
          )}

          {user?.role === "seeker" && (
            <Link to="/applications" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
              My applications
            </Link>
          )}

          {user ? (
            <div className="ml-3 flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 transition-colors hover:border-indigo-200 hover:bg-indigo-50">
                <UserAvatar user={user} size={30} className="!rounded-full" />
                <span className="text-sm font-medium text-slate-700">{user.name?.split(" ")[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2.5">
                Log out
              </button>
            </div>
          ) : (
            <div className="ml-3 flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
                Log in
              </Link>
              <Link to="/signup" className="btn-primary !px-4 !py-2.5">
                Sign up
              </Link>
            </div>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
          >
            <div className="container-page flex flex-col gap-4 py-5">
              <Link to="/jobs" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600">
                Jobs
              </Link>
              {user?.role === "employer" && (
                <>
                  <Link to="/employer/jobs" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600">
                    My postings
                  </Link>
                  <Link to="/employer/jobs/new" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600">
                    Post a job
                  </Link>
                </>
              )}
              {user?.role === "seeker" && (
                <Link to="/applications" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600">
                  My applications
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-left text-sm font-medium text-slate-600">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-slate-600">
                    Log in
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary w-full">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
