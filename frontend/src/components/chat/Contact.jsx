import React from "react";
import Avatar from "./Avatar";

const Contact = ({
  userId,
  username,
  selectedUserId,
  setSelectedUserId,
  isOnline,
  avatarLink,
}) => {
  return (
    <li
      key={userId}
      className={`${
        selectedUserId === userId ? "bg-blue-600" : ""
      } capitalize py-2 lg:py-3 px-2 lg:px-5 rounded-[1.3rem] cursor-pointer transition hover:scale-[1.01] hover:bg-blue-500/20`}
      onClick={() => {
        setSelectedUserId(userId);
      }}
    >
      <Avatar
        userId={userId}
        username={username}
        isOnline={isOnline}
        avatarLink={avatarLink}
      />
      <span className="text-xs lg:text-base text-center">{username}</span>
      {isOnline && (
        <span className="text-xs rounded-full bg-green-500 px-2 py-1">
          Active
        </span>
      )}
    </li>
  );
};

export default Contact;