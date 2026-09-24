import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseBusiness, ArrowUp } from "lucide-react";

const Footer = () => (
  <footer className="mt-auto border-t border-slate-200 bg-white">
    <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] lg:items-start">
      <div>
        <Link to="/" className="inline-flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <BriefcaseBusiness size={18} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-slate-900">Fieldnote</span>
        </Link>
        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">A clearer path to your next opportunity, and a better way to find your next teammate.</p>
      </div>

      <nav aria-label="Footer navigation" className="flex flex-col items-start gap-3 text-sm">
        <span className="font-semibold text-slate-900">Explore</span>
        <Link to="/jobs" className="text-slate-600 hover:text-indigo-600">Browse jobs</Link>
        <Link to="/signup" className="text-slate-600 hover:text-indigo-600">Create an account</Link>
      </nav>

      <div className="flex flex-col items-start gap-3 text-sm">
        <span className="font-semibold text-slate-900">Get in touch</span>
        <a href="mailto:support@fieldnote.com" className="text-slate-600 hover:text-indigo-600">support@fieldnote.com</a>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600">
          Back to top <ArrowUp size={15} />
        </button>
      </div>
    </div>
    <div className="border-t border-slate-100">
      <div className="container-page flex flex-col gap-2 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} Fieldnote. All rights reserved.</span>
        <Link to="/" className="hover:text-indigo-600">Find your next chapter</Link>
      </div>
    </div>
  </footer>
);

export default Footer;
