import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, MapPin } from "lucide-react";
import api from "../api/axios.js";

const statusColor = {
  applied: "border-slate-200 bg-slate-100 text-slate-600",
  viewed: "border-indigo-200 bg-indigo-50 text-indigo-700",
  shortlisted: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
  hired: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const MyApplications = () => {
  const [applications, setApplications] = useState(null);

  useEffect(() => {
    api.get("/applications/mine").then((res) => setApplications(res.data)).catch(() => setApplications([]));
  }, []);

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-semibold text-slate-900">My applications</h1>

      <div className="mt-8 grid gap-6">
        {applications === null ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-slate-500">
            You haven't applied to anything yet.{" "}
            <Link to="/jobs" className="font-medium text-indigo-600 hover:text-indigo-500">Browse open roles</Link>
          </p>
        ) : (
          applications.map((app) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    <BriefcaseBusiness size={14} />
                    <span>Application</span>
                  </div>

                  <Link to={`/jobs/${app.job?._id}`} className="mt-3 inline-flex items-center gap-2 font-display text-xl font-semibold text-slate-900 hover:text-indigo-600">
                    {app.job?.title || "Job no longer available"}
                    <ArrowUpRight size={16} />
                  </Link>

                  <p className="mt-2 text-sm text-slate-500">{app.job?.companyName}</p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={14} />
                    <span>{app.job?.location}</span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusColor[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyApplications;
