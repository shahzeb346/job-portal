import React from "react";
import UserAvatar from "./UserAvatar.jsx";

const ProfileHeader = ({ user }) => {
  return (
    <div className="flex items-center gap-4 border-b border-line pb-6">
      <UserAvatar user={user} size={72} className="!rounded-full" />
      <div>
        <p className="font-display text-2xl font-semibold text-ink">{user?.name || "Fieldnote User"}</p>
        <p className="text-sm text-ink-soft">{user?.headline || "Professional profile"}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
