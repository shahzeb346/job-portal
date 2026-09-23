import React from "react";
import { Globe2, Plane, House, Heart } from "lucide-react";

const GulfSupport = ({ job }) => {
  if (!job) return null;

  const supportItems = [
    job.visaSponsorship && { label: "Visa Sponsorship", color: "bg-indigo-50 text-indigo-700", icon: Plane },
    job.relocationSupport && { label: "Relocation", color: "bg-violet-50 text-violet-700", icon: Globe2 },
    job.accommodationSupport && { label: "Accommodation", color: "bg-amber-50 text-amber-700", icon: House },
    job.familySupport && { label: "Family Support", color: "bg-rose-50 text-rose-700", icon: Heart },
  ].filter(Boolean);

  if (!job.country && !job.currency && supportItems.length === 0) return null;

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Globe2 size={16} />
        </div>
        <h2 className="font-display text-xl font-semibold text-slate-900">Gulf support</h2>
      </div>

      <div className="mt-4 space-y-3">
        {job.country && (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Country</span>
            <span className="text-sm font-medium text-slate-700">{job.country}</span>
          </div>
        )}

        {job.currency && (
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">Currency</span>
            <span className="text-sm font-medium text-slate-700">{job.currency}</span>
          </div>
        )}
      </div>

      {supportItems.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {supportItems.map(({ label, color, icon: Icon }) => (
            <span
              key={label}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${color}`}
            >
              <Icon size={12} />
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default GulfSupport;
