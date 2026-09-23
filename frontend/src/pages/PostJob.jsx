import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios.js";

const emptyForm = {
  title: "", description: "", location: "", jobType: "full-time",
  category: "", experienceLevel: "entry", salaryMin: "", salaryMax: "",
  requirementsText: "", country: "", currency: "", visaSponsorship: "",
  relocationSupport: "", accommodationSupport: "", familySupport: "",
};

const PostJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    const requirements = form.requirementsText
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    if (companyLogo) {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("location", form.location);
      fd.append("jobType", form.jobType);
      fd.append("category", form.category);
      fd.append("experienceLevel", form.experienceLevel);
      fd.append("salaryMin", String(Number(form.salaryMin) || 0));
      fd.append("salaryMax", String(Number(form.salaryMax) || 0));
      fd.append("requirements", JSON.stringify(requirements));
      fd.append("country", form.country || "");
      fd.append("currency", form.currency || "");
      fd.append("visaSponsorship", String(form.visaSponsorship === "yes"));
      fd.append("relocationSupport", String(form.relocationSupport === "yes"));
      fd.append("accommodationSupport", String(form.accommodationSupport === "yes"));
      fd.append("familySupport", String(form.familySupport === "yes"));
      fd.append("companyLogo", companyLogo);

      await api.post("/jobs", fd);
    } else {
      await api.post("/jobs", {
        title: form.title,
        description: form.description,
        location: form.location,
        jobType: form.jobType,
        category: form.category,
        experienceLevel: form.experienceLevel,
        salaryMin: Number(form.salaryMin) || 0,
        salaryMax: Number(form.salaryMax) || 0,
        requirements,
        country: form.country,
        currency: form.currency,
        visaSponsorship: form.visaSponsorship === "yes",
        relocationSupport: form.relocationSupport === "yes",
        accommodationSupport: form.accommodationSupport === "yes",
        familySupport: form.familySupport === "yes",
      });
    }

    navigate("/employer/jobs");
  } catch (err) {
    setError(err.response?.data?.message || "Could not post the job.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="container-page max-w-4xl py-14">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-indigo-600">Employer tools</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900">Post a role</h1>
        <p className="mt-2 text-sm text-slate-500">This goes live immediately once published.</p>

        <form onSubmit={handleSubmit} className="panel mt-8 p-6 sm:p-8">
          <div className="grid gap-5">
            <div>
              <label className="label">Job title</label>
              <input name="title" required className="input" value={form.title} onChange={handleChange} placeholder="Senior Product Designer" />
            </div>

            <div>
              <label className="label">Company logo</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="input"
                onChange={(e) => setCompanyLogo(e.target.files?.[0] || null)}
              />
              {companyLogo && (
                <img
                  src={URL.createObjectURL(companyLogo)}
                  alt="Company logo preview"
                  className="mt-3 h-16 w-16 rounded-xl object-cover border border-slate-200"
                />
              )}
            </div>

            <div>
              <label className="label">Description</label>
              <textarea name="description" required rows={6} className="input resize-none" value={form.description} onChange={handleChange} placeholder="What the role involves, day to day…" />
            </div>

            <div>
              <label className="label">Requirements (one per line)</label>
              <textarea name="requirementsText" rows={4} className="input resize-none" value={form.requirementsText} onChange={handleChange} placeholder={"5+ years of product design\nStrong portfolio\nFigma fluency"} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label">Location</label>
                <input name="location" required className="input" value={form.location} onChange={handleChange} placeholder="Remote / City" />
              </div>
              <div>
                <label className="label">Category</label>
                <input name="category" required className="input" value={form.category} onChange={handleChange} placeholder="Design, Engineering…" />
              </div>
              <div>
                <label className="label">Job type</label>
                <select name="jobType" className="input" value={form.jobType} onChange={handleChange}>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="label">Experience level</label>
                <select name="experienceLevel" className="input" value={form.experienceLevel} onChange={handleChange}>
                  <option value="entry">Entry</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
              <div>
                <label className="label">Salary min (optional)</label>
                <input name="salaryMin" type="number" className="input" value={form.salaryMin} onChange={handleChange} placeholder="60000" />
              </div>
              <div>
                <label className="label">Salary max (optional)</label>
                <input name="salaryMax" type="number" className="input" value={form.salaryMax} onChange={handleChange} placeholder="90000" />
              </div>
            </div>

            <fieldset className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <legend className="px-2 font-display text-sm font-semibold text-slate-900">Gulf &amp; relocation support</legend>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">Country</label>
                  <select name="country" className="input" value={form.country} onChange={handleChange}>
                    <option value="">Select Country</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Oman">Oman</option>
                    <option value="Bahrain">Bahrain</option>
                  </select>
                </div>
                <div>
                  <label className="label">Currency</label>
                  <select name="currency" className="input" value={form.currency} onChange={handleChange}>
                    <option value="">Select Currency</option>
                    <option value="PKR">PKR — Pakistani Rupee</option>
                    <option value="SAR">SAR — Saudi Riyal</option>
                    <option value="AED">AED — UAE Dirham</option>
                    <option value="QAR">QAR — Qatari Riyal</option>
                    <option value="KWD">KWD — Kuwaiti Dinar</option>
                    <option value="OMR">OMR — Omani Rial</option>
                    <option value="BHD">BHD — Bahraini Dinar</option>
                  </select>
                </div>
                <div>
                  <label className="label">Visa Sponsorship</label>
                  <select name="visaSponsorship" className="input" value={form.visaSponsorship} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="label">Relocation Support</label>
                  <select name="relocationSupport" className="input" value={form.relocationSupport} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="label">Accommodation Support</label>
                  <select name="accommodationSupport" className="input" value={form.accommodationSupport} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="label">Family Support</label>
                  <select name="familySupport" className="input" value={form.familySupport} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <motion.button whileTap={{ scale: 0.98 }} disabled={loading} className="btn-primary mt-2 w-full sm:w-auto">
              {loading ? "Publishing…" : "Publish job"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PostJob;
