import React, { useMemo, useRef, useState } from "react";

const ResumeUpload = ({ value, onChange, error = "" }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [localError, setLocalError] = useState("");

  const validate = (candidate) => {
    if (!candidate) {
      setLocalError("Please select a resume.");
      return false;
    }

    if (candidate.type !== "application/pdf" && candidate.name?.split(".").pop()?.toLowerCase() !== "pdf") {
      setLocalError("Only PDF resumes are allowed.");
      return false;
    }

    if (candidate.size > 5 * 1024 * 1024) {
      setLocalError("Resume must be smaller than 5MB.");
      return false;
    }

    return true;
  };

  const handleFile = (candidate) => {
    if (!validate(candidate)) return;

    setFile(candidate);
    setLocalError("");
    if (onChange) onChange(candidate);
  };

  const remove = () => {
    setFile(null);
    setLocalError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onChange) onChange(null);
  };

  const sizeLabel = useMemo(() => {
    if (!file) return "";
    const sizeKB = Math.round(file.size / 1024);
    return sizeKB >= 1024 ? `${Math.round(sizeKB / 1024)} MB` : `${sizeKB} KB`;
  }, [file]);

  return (
    <div className="flex flex-col gap-2">
      <label className="label">Resume</label>
      <div className="w-full rounded-sm border border-line bg-paper-dim p-4">
        {!file ? (
          <button type="button" onClick={() => fileInputRef.current?.click()} className="flex w-full flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-line px-4 py-8 text-center hover:border-gold-dark">
            <span className="text-2xl text-ink-soft">⇪</span>
            <span className="font-display text-sm font-semibold text-ink">Upload Resume</span>
            <span className="text-xs text-ink-faint">PDF, max 5MB</span>
            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          </button>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-lg">📄</span>
              <div className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink">{file.name}</span>
                <span className="block text-xs text-ink-faint">{sizeLabel}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm text-ink-soft underline underline-offset-4">Replace</button>
              <button type="button" onClick={remove} className="text-sm text-brick underline underline-offset-4">Remove</button>
            </div>
          </div>
        )}
      </div>
      {(localError || error) && <p className="text-sm text-brick">{localError || error}</p>}
    </div>
  );
};

export default ResumeUpload;
