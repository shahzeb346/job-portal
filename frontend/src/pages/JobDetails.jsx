import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Building2, Clock3, MapPin, WalletCards } from "lucide-react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import ResumeUpload from "../components/ResumeUpload.jsx";
import GulfSupport from "../components/GulfSupport.jsx";

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ resumeFile: null, coverLetter: "" });

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data)).catch(() => setJob(false));
  }, [id]);

  const handleResumeFile = (file) => {
    setForm({ ...form, resumeFile: file || null });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.resumeFile) {
      setError("Please select a resume.");
      return;
    }

    setApplying(true);
    try {
      const uploadData = new FormData();
      uploadData.append("resume", form.resumeFile);
      const resumeUploadResponse = await api.post("/users/me/resume", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resume = resumeUploadResponse.data.resume;
      await api.post(`/applications/${id}`, {
        resume,
        coverLetter: form.coverLetter,
      });

      setApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit your application.");
    } finally {
      setApplying(false);
    }
  };

  if (job === null) return <div className="container-page py-16 text-sm text-slate-500">Loading…</div>;
  if (job === false) return <div className="container-page py-16 text-sm text-slate-500">This job could not be found.</div>;

  const resolveImageUrl = (value) => {
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
    return `${baseUrl}${value.startsWith("/") ? value : `/${value}`}`;
  };

  const companyLogo = resolveImageUrl(
    job.companyLogo || job.employer?.company?.logoUrl || job.employer?.profileImage || ""
  );
  const companyName = job.companyName || job.employer?.company?.name || job.employer?.name || "Company";
  const salary = job.salaryMin || job.salaryMax ? `${job.currency || "USD"} ${Number(job.salaryMin || 0).toLocaleString()}${job.salaryMax ? ` – ${Number(job.salaryMax).toLocaleString()}` : ""}` : "Salary available on request";

  return (
    <div className="container-page py-14">
      <div className="grid gap-8 lg:grid-cols-[1.55fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="panel p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                  {companyLogo ? (
                    <img src={companyLogo} alt={companyName} className="h-full w-full object-cover" />
                  ) : (
                    <Building2 size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{companyName}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              {job.country && (
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {job.country}
                </span>
              )}
            </div>

            <h1 className="mt-6 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">{job.title}</h1>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge border-indigo-200 bg-indigo-50 text-indigo-700">{job.jobType}</span>
              <span className="badge border-slate-200 bg-slate-100 text-slate-600">{job.category}</span>
              <span className="badge border-violet-200 bg-violet-50 text-violet-700">{job.experienceLevel}</span>
            </div>
          </div>

          <div className="panel p-6 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600">
                  <BriefcaseBusiness size={15} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Role</p>
                  <p className="text-sm font-semibold text-slate-700">{job.jobType}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-indigo-600">
                  <Clock3 size={15} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Experience</p>
                  <p className="text-sm font-semibold text-slate-700">{job.experienceLevel}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 whitespace-pre-line text-[15px] leading-7 text-slate-600">
              {job.description}
            </div>
          </div>

          <div className="panel p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <WalletCards size={18} />
              </div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">Salary</h2>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-[10px] uppercase tracking-[0.12em] text-emerald-700">Compensation</p>
              <p className="mt-2 text-xl font-bold text-slate-900">{salary}</p>
            </div>

            <GulfSupport job={job} />
          </div>

          {job.requirements?.length > 0 && (
            <div className="panel p-6 sm:p-7">
              <h2 className="font-display text-2xl font-semibold text-slate-900">Requirements</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:pt-2"
        >
          <div className="panel sticky top-24 overflow-hidden p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BriefcaseBusiness size={18} />
              </div>
              <h2 className="font-display text-2xl font-semibold text-slate-900">Apply now</h2>
            </div>

            {!user && (
              <>
                <p className="text-sm text-slate-600">Log in as a job seeker to apply to this role.</p>
                <button onClick={() => navigate("/login")} className="btn-primary mt-5 w-full">Log in to apply</button>
              </>
            )}

            {user?.role === "employer" && (
              <p className="text-sm text-slate-600">You're signed in as an employer, so applying isn't available.</p>
            )}

            {user?.role === "seeker" && !applied && (
              <form onSubmit={handleApply} className="flex flex-col gap-4">
                <ResumeUpload onChange={handleResumeFile} />
                <div>
                  <label className="label">Cover letter (optional)</label>
                  <textarea
                    rows={4}
                    className="input resize-none"
                    value={form.coverLetter}
                    onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
                    placeholder="A few lines on why you're a fit"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <motion.button whileTap={{ scale: 0.98 }} disabled={applying} className="btn-primary w-full">
                  {applying ? "Submitting application..." : "Submit application"}
                </motion.button>
              </form>
            )}

            {applied && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <p className="font-display text-2xl font-semibold text-emerald-600">Application sent</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  You'll see status updates in My applications as {companyName} reviews it.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetails;
