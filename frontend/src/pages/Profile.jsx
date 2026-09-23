import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, setUser } = useAuth();
  const isSeeker = user?.role === "seeker";
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(
    isSeeker
      ? {
          name: user?.name || "",
          headline: user?.headline || "",
          skills: (user?.skills || []).join(", "),
          experience: user?.experience || "",
          education: user?.education || "",
          resumeUrl: user?.resumeUrl || "",
        }
      : {
          name: user?.name || "",
          companyName: user?.company?.name || "",
          website: user?.company?.website || "",
          industry: user?.company?.industry || "",
          description: user?.company?.description || "",
        }
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    try {
      const payload = isSeeker
        ? {
            name: form.name,
            headline: form.headline,
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
            experience: form.experience,
            education: form.education,
            resumeUrl: form.resumeUrl,
          }
        : {
            name: form.name,
            company: {
              name: form.companyName,
              website: form.website,
              industry: form.industry,
              description: form.description,
            },
          };
      const { data } = await api.put("/users/me", payload);
      setUser((prev) => ({ ...prev, ...data }));
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save your profile.");
    }
  };

  if (!user) return null;

  return (
    <div className="container-page py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-semibold text-slate-900">
          {isSeeker ? "Your profile" : "Company profile"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {isSeeker ? "Keep this current — it's what employers see." : "This shows on every job you post."}
        </p>

        <form onSubmit={handleSubmit} className="panel mt-8 p-6 sm:p-8">
          <div className="grid gap-5">
            <div>
              <label className="label">Name</label>
              <input name="name" className="input" value={form.name} onChange={handleChange} />
            </div>

            {isSeeker ? (
              <>
                <div>
                  <label className="label">Headline</label>
                  <input name="headline" className="input" value={form.headline} onChange={handleChange} placeholder="Frontend engineer, 4 years" />
                </div>
                <div>
                  <label className="label">Skills (comma separated)</label>
                  <input name="skills" className="input" value={form.skills} onChange={handleChange} placeholder="React, Node.js, SQL" />
                </div>
                <div>
                  <label className="label">Experience</label>
                  <textarea name="experience" rows={3} className="input resize-none" value={form.experience} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Education</label>
                  <input name="education" className="input" value={form.education} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Resume link</label>
                  <input name="resumeUrl" type="url" className="input" value={form.resumeUrl} onChange={handleChange} placeholder="https://…" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="label">Company name</label>
                  <input name="companyName" className="input" value={form.companyName} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">Website</label>
                  <input name="website" type="url" className="input" value={form.website} onChange={handleChange} placeholder="https://…" />
                </div>
                <div>
                  <label className="label">Industry</label>
                  <input name="industry" className="input" value={form.industry} onChange={handleChange} />
                </div>
                <div>
                  <label className="label">About the company</label>
                  <textarea name="description" rows={4} className="input resize-none" value={form.description} onChange={handleChange} />
                </div>
              </>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <motion.button whileTap={{ scale: 0.98 }} className="btn-primary mt-1 w-full sm:w-auto">
              Save changes
            </motion.button>

            {saved && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-emerald-600">
                Saved.
              </motion.p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
