import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BriefcaseBusiness, Building2, TrendingUp, Users } from "lucide-react";
import api from "../api/axios.js";
import JobCard from "../components/JobCard.jsx";

const Home = () => {
  const [stats, setStats] = useState({ total: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get("/jobs?limit=5&sort=-createdAt").then((res) => {
      setStats({ total: res.data.total });
      setRecent(res.data.jobs);
    }).catch(() => {});
  }, []);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="bg-paper">
      <section className="border-b border-slate-200 bg-[#FAF9F6]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="container-page grid gap-10 py-16 md:py-20 lg:grid-cols-12 lg:items-center"
        >
          <div className="lg:col-span-7">
            <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
              <BriefcaseBusiness size={14} />
              {stats.total ? `${stats.total} open roles right now` : "Open roles available"}
            </motion.div>

            <motion.h1
              variants={item}
              className="mt-6 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Find a role that moves your next chapter forward.
            </motion.h1>

            <motion.p variants={item} className="mt-5 max-w-xl text-lg text-slate-600">
              Discover high-quality opportunities, compare salaries, and move confidently toward the next step in your career.
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
              <Link to="/jobs" className="btn-primary">
                Browse jobs
                <ArrowRight size={16} />
              </Link>
              <Link to="/signup" className="btn-secondary">
                Post a job
              </Link>
            </motion.div>

            <motion.div variants={item} className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Roles</p>
                <p className="mt-2 font-display text-2xl font-semibold text-slate-900">{stats.total || "—"}</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Hiring</p>
                <p className="mt-2 font-display text-2xl font-semibold text-slate-900">60%</p>
              </div>
              <div className="panel p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">Employers</p>
                <p className="mt-2 font-display text-2xl font-semibold text-slate-900">1.4k</p>
              </div>
            </motion.div>
          </div>

          <motion.div variants={item} className="lg:col-span-5 lg:justify-self-end">
            <div className="panel p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-400">This week</p>
                  <p className="mt-3 font-display text-4xl font-semibold text-slate-900">{stats.total || "0"}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="mt-6 h-px w-full bg-slate-200" />

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-indigo-600" />
                    <span className="text-sm text-slate-600">Active companies</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">241</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-indigo-600" />
                    <span className="text-sm text-slate-600">Applicants</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">4.8k</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {recent.length > 0 && (
        <section className="container-page py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-600">Featured</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">Recently posted</h2>
            </div>
            <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600">
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {recent.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </section>
      )}
     
      <section className="border-t border-slate-200 bg-slate-50/60">
        <div className="container-page grid gap-6 py-16 md:grid-cols-2">
          <div className="panel p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-600">For job seekers</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-slate-900">Build one profile. Apply faster.</h3>
            <p className="mt-3 text-slate-600">
              Keep your profile current, save roles you like, and track every response in a single, simple dashboard.
            </p>
          </div>

          <div className="panel p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-indigo-600">For employers</p>
            <h3 className="mt-3 font-display text-2xl font-semibold text-slate-900">Build a better hiring pipeline.</h3>
            <p className="mt-3 text-slate-600">
              Post roles quickly, review applicants side by side, and move confidently to the people who fit your team.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
