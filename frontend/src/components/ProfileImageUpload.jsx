import React, { useMemo, useRef, useState } from "react";
import UserAvatar from "./UserAvatar.jsx";

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
const allowedExtensions = ["jpg", "jpeg", "png"];

const ProfileImageUpload = ({ value, onChange, error = "", label = "Upload profile picture" }) => {
  const fileInputRef = useRef(null);
  const [localFile, setLocalFile] = useState(null);
  const [localError, setLocalError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(value || "");

  const validate = (file) => {
    if (!file) {
      setLocalError("Please select a profile picture.");
      return false;
    }

    const typeMatch = allowedImageTypes.includes(file.type) || allowedExtensions.includes(file.name?.split(".").pop()?.toLowerCase());
    if (!typeMatch) {
      setLocalError("Only JPG, JPEG, and PNG images are allowed.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLocalError("Profile picture must be smaller than 5MB.");
      return false;
    }

    return true;
  };

  const handleFile = (file) => {
    if (!file || !validate(file)) return;

    const preview = URL.createObjectURL(file);
    setLocalFile(file);
    setPreviewUrl(preview);
    setLocalError("");
    if (onChange) onChange(file, preview);
  };

  const remove = () => {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setLocalFile(null);
    setPreviewUrl("");
    setLocalError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onChange) onChange(null, "");
  };

  const displaySize = useMemo(() => {
    if (!localFile) return "";
    const size = Math.round(localFile.size / 1024);
    return size >= 1024 ? `${Math.round(size / 1024)} MB` : `${size} KB`;
  }, [localFile]);

  return (
    <div className="flex flex-col gap-3">
      <label className="label">Profile picture</label>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-line bg-paper-dim">
            {previewUrl ? (
              <img src={previewUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <UserAvatar user={{ name: "Fieldnote", profileImage: "" }} size={90} className="!rounded-full" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 rounded-full border border-line bg-paper px-3 py-1 text-[11px] font-medium text-ink shadow-sm hover:text-gold-dark"
          >
            Edit
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-secondary !py-2">
              {previewUrl ? "Change Photo" : "Upload Photo"}
            </button>
            {previewUrl && (
              <button type="button" onClick={remove} className="text-sm text-brick underline underline-offset-4">
                Remove
              </button>
            )}
          </div>
          <span className="text-xs text-ink-faint">{localFile ? `${localFile.name} · ${displaySize}` : label}</span>
        </div>
      </div>
      {(localError || error) && <p className="text-sm text-brick">{localError || error}</p>}
    </div>
  );
};

export default ProfileImageUpload;
