import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BriefcaseBusiness, MapPin, Trash2, Users } from "lucide-react";
import api from "../api/axios.js";

const EmployerJobs = () => {
  const [jobs, setJobs] = useState(null);

  const load = () => {
    api.get("/jobs/employer/mine").then((res) => setJobs(res.data)).catch(() => setJobs([]));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this job posting? This also removes its applications.")) return;
    await api.delete(`/jobs/${id}`);
    load();
  };

  return (
    <div className="container-page py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-600">Employer dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900">My postings</h1>
        </div>
        <Link to="/employer/jobs/new" className="btn-primary">Post a job</Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {jobs === null ? (
          <p className="text-sm text-slate-500 md:col-span-2 xl:col-span-3">Loading…</p>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-slate-500 md:col-span-2 xl:col-span-3">You haven't posted any jobs yet.</p>
        ) : (
          jobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel flex h-full flex-col justify-between p-5"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <BriefcaseBusiness size={18} />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {job.status || "Open"}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-xl font-semibold text-slate-900">{job.title}</h2>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={15} />
                  <span>{job.location}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="badge border-indigo-200 bg-indigo-50 text-indigo-700">{job.jobType}</span>
                  <span className="badge border-slate-200 bg-slate-100 text-slate-600">{job.category || "General"}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Users size={15} className="text-slate-400" />
                    <span>{job.applicantsCount || 0} applicant{(job.applicantsCount || 0) !== 1 ? "s" : ""}</span>
                  </div>
                  <span>{new Date(job.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link to={`/employer/jobs/${job._id}/applicants`} className="btn-secondary flex-1 !py-2.5">
                    View applicants
                  </Link>
                  <button onClick={() => handleDelete(job._id)} className="btn-danger !px-3 !py-2.5" aria-label={`Delete ${job.title}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployerJobs;
