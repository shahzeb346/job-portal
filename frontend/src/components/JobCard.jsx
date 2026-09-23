// import React from "react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// const typeLabel = {
//   "full-time": "Full-time",
//   "part-time": "Part-time",
//   contract: "Contract",
//   internship: "Internship",
//   remote: "Remote",
// };

// const formatSalary = (min, max, currency) => {
//   if (!min && !max) return null;
//   const fmt = (n) => `${currency === "USD" ? "$" : currency + " "}${Math.round(n / 1000)}k`;
//   if (min && max) return `${fmt(min)} – ${fmt(max)}`;
//   return fmt(min || max);
// };

// const JobCard = ({ job }) => {
//   const salaryCurrency = job.currency || job.salaryCurrency || "USD";
//   const salary = formatSalary(job.salaryMin, job.salaryMax, salaryCurrency);

//   return (
//     <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
//       <Link
//         to={`/jobs/${job._id}`}
//         className="group flex flex-col gap-3 border-b border-line py-6 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
//       >
//         <div className="min-w-0">
//           <div className="flex items-center gap-2 text-xs text-ink-faint">
//             <span>{job.companyName}</span>
//             <span>·</span>
//             <span>{job.location}</span>
//           </div>
//           <h3 className="mt-1 font-display text-lg font-medium text-ink group-hover:text-gold-dark">
//             {job.title}
//           </h3>
//           <div className="mt-2 flex flex-wrap items-center gap-2">
//             <span className="rounded-sm border border-line px-2 py-0.5 text-xs text-ink-soft">
//               {typeLabel[job.jobType] || job.jobType}
//             </span>
//             <span className="rounded-sm border border-line px-2 py-0.5 text-xs text-ink-soft">
//               {job.category}
//             </span>
//             {job.country && (
//               <span className="rounded-sm border border-line px-2 py-0.5 text-xs text-ink-soft">
//                 {job.country}
//               </span>
//             )}
//             {job.currency && (
//               <span className="rounded-sm border border-line px-2 py-0.5 text-xs text-ink-soft">
//                 {job.currency}
//               </span>
//             )}
//             {job.visaSponsorship && (
//               <span className="rounded-sm border border-line px-2 py-0.5 text-xs text-ink-soft">Visa Sponsorship</span>
//             )}
//             {job.relocationSupport && (
//               <span className="rounded-sm border border-line px-2 py-0.5 text-xs text-ink-soft">Relocation Support</span>
//             )}
//             {salary && (
//               <span className="rounded-sm border border-line px-2 py-0.5 text-xs text-ink-soft">
//                 {salary}
//               </span>
//             )}
//           </div>
//         </div>
//         <div className="shrink-0 text-sm text-ink-faint">
//           {new Date(job.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
//         </div>
//       </Link>
//     </motion.div>
//   );
// };

// export default JobCard;


import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  CalendarDays,
  BriefcaseBusiness,
  Wallet,
  Globe2,
  Plane,
  House,
  Heart,
  ArrowUpRight,
} from "lucide-react";

const typeLabel = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

const formatSalary = (min, max, currency) => {
  if (!min && !max) return null;

  const fmt = (n) =>
    `${currency === "USD" ? "$" : currency + " "}${Math.round(n / 1000)}k`;

  if (min && max) return `${fmt(min)} – ${fmt(max)}`;

  return fmt(min || max);
};

const JobCard = ({ job }) => {
  const salaryCurrency = job.currency || job.salaryCurrency || "USD";
  const salary = formatSalary(
    job.salaryMin,
    job.salaryMax,
    salaryCurrency
  );

  const jobType = typeLabel[job.jobType] || job.jobType;

  const resolveImageUrl = (value) => {
    if (!value) return "";
    if (/^https?:\/\//i.test(value)) return value;
    const baseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
    return `${baseUrl}${value.startsWith("/") ? value : `/${value}`}`;
  };

  const companyLogo = resolveImageUrl(
    job.companyLogo ||
    job.employer?.company?.logoUrl ||
    job.employer?.profileImage ||
    ""
  );

  const companyName =
    job.companyName ||
    job.employer?.company?.name ||
    job.employer?.name ||
    "Company";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        to={`/jobs/${job._id}`}
        className="
          group relative block h-full overflow-hidden
          rounded-2xl border border-slate-200
          bg-white p-5
          shadow-sm
          transition-all duration-300
          hover:border-indigo-200
          hover:shadow-xl hover:shadow-indigo-100/50
        "
      >
        {/* Top accent */}
        <div
          className="
            absolute inset-x-0 top-0 h-1
            bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500
            opacity-0 transition-opacity duration-300
            group-hover:opacity-100
          "
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            {/* Company Logo */}
            <div
              className="
                flex h-12 w-12 shrink-0 items-center justify-center
                rounded-xl
                bg-gradient-to-br from-indigo-50 to-purple-100
                text-indigo-600
                ring-1 ring-indigo-100
              "
            >
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <Building2 size={22} />
              )}
            </div>

            {/* Company + Location */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-slate-700">
                  {companyName}
                </p>

                {job.country && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                    {job.country}
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin size={13} className="shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
            <CalendarDays size={12} />

            {new Date(job.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Job Title */}
        <div className="mt-5">
          <div className="flex items-start justify-between gap-3">
            <h3
              className="
                line-clamp-2
                text-lg font-bold leading-snug
                text-slate-900
                transition-colors duration-200
                group-hover:text-indigo-600
              "
            >
              {job.title}
            </h3>

            <div
              className="
                mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center
                rounded-full border border-slate-200
                text-slate-400
                transition-all duration-200
                group-hover:border-indigo-200
                group-hover:bg-indigo-50
                group-hover:text-indigo-600
              "
            >
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>

        {/* Main Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {jobType && (
            <span
              className="
                inline-flex items-center gap-1.5
                rounded-lg bg-indigo-50
                px-2.5 py-1.5
                text-xs font-semibold text-indigo-700
              "
            >
              <BriefcaseBusiness size={13} />
              {jobType}
            </span>
          )}

          {job.category && (
            <span
              className="
                rounded-lg bg-slate-100
                px-2.5 py-1.5
                text-xs font-medium text-slate-600
              "
            >
              {job.category}
            </span>
          )}

          {job.experienceLevel && (
            <span
              className="
                rounded-lg bg-purple-50
                px-2.5 py-1.5
                text-xs font-medium text-purple-700
              "
            >
              {job.experienceLevel}
            </span>
          )}
        </div>

        {/* Salary */}
        {salary && (
          <div
            className="
              mt-5 flex items-center justify-between
              rounded-xl border border-emerald-100
              bg-emerald-50/70 px-4 py-3
            "
          >
            <div className="flex items-center gap-2">
              <div
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded-lg bg-white text-emerald-600
                  shadow-sm
                "
              >
                <Wallet size={16} />
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-600">
                  Salary
                </p>

                <p className="text-sm font-bold text-slate-900">
                  {salary}
                </p>
              </div>
            </div>

            {job.currency && (
              <span className="text-xs font-semibold text-emerald-700">
                {job.currency}
              </span>
            )}
          </div>
        )}

        {/* Gulf Job Support */}
        {(job.visaSponsorship ||
          job.relocationSupport ||
          job.accommodationSupport ||
          job.familySupport) && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="mb-2 flex items-center gap-1.5">
              <Globe2 size={14} className="text-indigo-600" />

              <span className="text-xs font-bold text-slate-700">
                Gulf Job Support
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {job.visaSponsorship && (
                <span
                  className="
                    inline-flex items-center gap-1
                    rounded-md bg-blue-50
                    px-2 py-1
                    text-[10px] font-semibold text-blue-700
                  "
                >
                  <Plane size={11} />
                  Visa Sponsorship
                </span>
              )}

              {job.relocationSupport && (
                <span
                  className="
                    inline-flex items-center gap-1
                    rounded-md bg-violet-50
                    px-2 py-1
                    text-[10px] font-semibold text-violet-700
                  "
                >
                  <MapPin size={11} />
                  Relocation
                </span>
              )}

              {job.accommodationSupport && (
                <span
                  className="
                    inline-flex items-center gap-1
                    rounded-md bg-amber-50
                    px-2 py-1
                    text-[10px] font-semibold text-amber-700
                  "
                >
                  <House size={11} />
                  Accommodation
                </span>
              )}

              {job.familySupport && (
                <span
                  className="
                    inline-flex items-center gap-1
                    rounded-md bg-rose-50
                    px-2 py-1
                    text-[10px] font-semibold text-rose-700
                  "
                >
                  <Heart size={11} />
                  Family Support
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          className="
            mt-5 flex items-center justify-between
            border-t border-slate-100 pt-4
          "
        >
          <span className="text-xs text-slate-400">
            View job details
          </span>

          <span
            className="
              text-xs font-semibold text-indigo-600
              transition-transform duration-200
              group-hover:translate-x-1
            "
          >
            View Job →
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default JobCard;

