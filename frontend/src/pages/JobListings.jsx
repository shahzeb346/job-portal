import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios.js";
import JobCard from "../components/JobCard.jsx";

const jobTypes = ["full-time", "part-time", "contract", "internship", "remote"];

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: "", location: "", jobType: "" });

  const fetchJobs = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 10 });
      if (filters.keyword) params.set("keyword", filters.keyword);
      if (filters.location) params.set("location", filters.location);
      if (filters.jobType) params.set("jobType", filters.jobType);
      const { data } = await api.get(`/jobs?${params.toString()}`);
      setJobs(data.jobs);
      setTotal(data.total);
      setPages(data.pages);
      setPage(data.page);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(1); }, []); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1);
  };

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-3xl font-semibold text-ink">Browse roles</h1>
      <p className="mt-2 text-sm text-ink-soft">{total} open position{total !== 1 ? "s" : ""} right now</p>

      <form onSubmit={handleSearch} className="mt-8 grid gap-3 sm:grid-cols-[2fr_1.2fr_1fr_auto]">
        <input
          className="input" placeholder="Search title, company, or category"
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        />
        <input
          className="input" placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select
          className="input" value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
        >
          <option value="">Any type</option>
          {jobTypes.map((t) => (
            <option key={t} value={t}>{t.replace("-", " ")}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="mt-10">
        {loading ? (
          <p className="text-sm text-ink-faint">Loading roles…</p>
        ) : jobs.length === 0 ? (
          <p className="text-sm text-ink-faint">No roles match your search yet. Try broadening it.</p>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
           className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </motion.div>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchJobs(p)}
              className={`h-9 w-9 rounded-sm border text-sm ${
                p === page ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:border-ink"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobListings;
