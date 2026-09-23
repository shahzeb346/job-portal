import React from "react";

const UserAvatar = ({ user, size = 40, className = "", fallbackLetter = "" }) => {
  const image = user?.profileImage || user?.profileImageUrl || "";
  const name = user?.name || "User";
  const letter = (fallbackLetter || name || "U").charAt(0).toUpperCase();

  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-full border border-line bg-paper ${className}`}
      style={{ width: size, height: size }}
      title={name}
    >
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-display text-sm font-semibold text-ink">{letter}</span>
      )}
    </span>
  );
};

export default UserAvatar;
