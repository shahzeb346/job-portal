import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios.js";

const statusOptions = ["applied", "viewed", "shortlisted", "rejected", "hired"];

const statusColor = {
  applied: "bg-slate-100 text-slate-600 border-slate-200",
  viewed: "bg-indigo-50 text-indigo-700 border-indigo-200",
  shortlisted: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  hired: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const Applicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    api.get(`/applications/job/${jobId}`).then((res) => setApplications(res.data)).catch(() => setApplications([]));
  }, [jobId]);

  const handleStatusChange = async (id, status) => {
    const { data } = await api.patch(`/applications/${id}/status`, { status });
    setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status: data.status } : a)));
  };

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-semibold text-slate-900">Applicants</h1>

      <div className="mt-8 grid gap-6">
        {applications === null ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : applications.length === 0 ? (
          <p className="text-sm text-slate-500">No applications yet for this role.</p>
        ) : (
          applications.map((app) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-display text-xl font-semibold text-slate-900">{app.applicant?.name}</p>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${statusColor[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{app.applicant?.email}</p>
                  {app.applicant?.headline && <p className="mt-1 text-sm text-slate-600">{app.applicant.headline}</p>}

                  {app.applicant?.skills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {app.applicant.skills.map((s, i) => (
                        <span key={i} className="badge border-slate-200 bg-slate-100 text-slate-600">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex gap-4 text-sm">
                    <button type="button" onClick={() => setSelectedApplicant(app)} className="font-medium text-indigo-600 hover:text-indigo-500">
                      View resume
                    </button>
                  </div>

                  {app.coverLetter && <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{app.coverLetter}</p>}
                </div>

                <div className="min-w-[180px]">
                  <label className="label">Application status</label>
                  <select
                    className="input"
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  >
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" onClick={() => setSelectedApplicant(null)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="applicant-resume-title"
            className="flex h-[94dvh] max-h-[1100px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <h2 id="applicant-resume-title" className="font-display text-2xl font-semibold text-slate-900">
                  {selectedApplicant.applicant?.name || "Applicant"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">{selectedApplicant.applicant?.email}</p>
              </div>
              <button type="button" onClick={() => setSelectedApplicant(null)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                Close
              </button>
            </header>

            <div className="grid min-h-0 flex-1 overflow-y-auto md:overflow-hidden md:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-h-[55vh] bg-slate-100 p-3 md:min-h-0">
                {selectedApplicant.resume?.url ? (
                  <iframe title={`${selectedApplicant.applicant?.name || "Applicant"} resume`} src={selectedApplicant.resume.url} className="h-[52vh] min-h-0 w-full rounded-lg border border-slate-200 bg-white md:h-full" />
                ) : (
                  <div className="flex h-full min-h-64 items-center justify-center text-sm text-slate-500">No resume was attached to this application.</div>
                )}
              </div>

              <aside className="space-y-5 p-5">
                <div>
                  <h3 className="font-semibold text-slate-900">Applicant information</h3>
                  {selectedApplicant.applicant?.headline && <p className="mt-2 text-sm text-slate-600">{selectedApplicant.applicant.headline}</p>}
                  <p className="mt-2 text-sm text-slate-600">Application status: <span className="font-medium capitalize">{selectedApplicant.status}</span></p>
                </div>

                {selectedApplicant.applicant?.skills?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Skills</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedApplicant.applicant.skills.map((skill, index) => <span key={`${skill}-${index}`} className="badge border-slate-200 bg-slate-100 text-slate-600">{skill}</span>)}
                    </div>
                  </div>
                )}

                {selectedApplicant.applicant?.experience && <div><h4 className="text-sm font-semibold text-slate-800">Experience</h4><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{selectedApplicant.applicant.experience}</p></div>}
                {selectedApplicant.applicant?.education && <div><h4 className="text-sm font-semibold text-slate-800">Education</h4><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{selectedApplicant.applicant.education}</p></div>}
                {selectedApplicant.coverLetter && <div><h4 className="text-sm font-semibold text-slate-800">Cover letter</h4><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{selectedApplicant.coverLetter}</p></div>}

                {selectedApplicant.resume?.url && (
                  <a href={selectedApplicant.resume.url} target="_blank" rel="noreferrer" className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    Open resume in new tab
                  </a>
                )}
                {selectedApplicant.applicant?.links && Object.entries(selectedApplicant.applicant.links).filter(([, url]) => url).map(([label, url]) => (
                  <p key={label} className="break-all text-sm"><span className="capitalize text-slate-500">{label}: </span><a href={url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{url}</a></p>
                ))}
              </aside>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Applicants;
