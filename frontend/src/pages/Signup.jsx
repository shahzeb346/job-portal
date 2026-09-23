import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseBusiness } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileImageUpload from "../components/ProfileImageUpload.jsx";

const Signup = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("seeker");
  const [form, setForm] = useState({ name: "", email: "", password: "", companyName: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  console.log(form)
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        profileImageFile: profileImage?.file || null,
        ...(role === "employer" ? { company: { name: form.companyName } } : {}),
      };
      const data = await register(payload);
      navigate(data.role === "employer" ? "/employer/jobs/new" : "/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-soft"
      >
        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <BriefcaseBusiness size={22} />
          </div>
        </div>

        <h1 className="mt-6 text-center font-display text-3xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Tell us which side of the table you're on.</p>

        <div className="relative mt-7 grid grid-cols-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
          <motion.div
            className="absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-indigo-600 shadow-sm"
            animate={{ x: role === "seeker" ? 0 : "calc(100% + 4px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          />
          <button
            type="button"
            onClick={() => setRole("seeker")}
            className={`relative z-10 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              role === "seeker" ? "text-white" : "text-slate-500"
            }`}
          >
            Job seeker
          </button>
          <button
            type="button"
            onClick={() => setRole("employer")}
            className={`relative z-10 rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              role === "employer" ? "text-white" : "text-slate-500"
            }`}
          >
            Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <ProfileImageUpload onChange={(file, preview) => setProfileImage(file ? { file, preview } : null)} />

          <div>
            <label className="label" htmlFor="name">{role === "employer" ? "Your name" : "Full name"}</label>
            <input
              id="name" name="name" type="text" required
              className="input" value={form.name} onChange={handleChange}
              placeholder="Jordan Ahmed"
            />
          </div>

          <AnimatePresence mode="wait">
            {role === "employer" && (
              <motion.div
                key="companyName"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <label className="label" htmlFor="companyName">Company name</label>
                <input
                  id="companyName" name="companyName" type="text" required
                  className="input" value={form.companyName} onChange={handleChange}
                  placeholder="Acme Inc."
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" required
              className="input" value={form.email} onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password" required minLength={6}
              className="input" value={form.password} onChange={handleChange}
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="btn-primary mt-1 w-full"
          >
            {loading ? "Creating account…" : role === "employer" ? "Create employer account" : "Create account"}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
