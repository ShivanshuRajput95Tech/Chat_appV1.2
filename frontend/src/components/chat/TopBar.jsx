import React from "react";

const TopBar = ({
  setSelectedUserId,
  selectedUserId,
  offlinePeople,
  onlinePeople,
  isSocketConnected,
  selectedUser,
  isTyping,
}) => {
  const fallbackName =
    onlinePeople[selectedUserId]?.username ||
    [offlinePeople[selectedUserId]?.firstName, offlinePeople[selectedUserId]?.lastName]
      .filter(Boolean)
      .join(" ");

  const displayName = selectedUser?.username || fallbackName || "User";
  const isOnline = Boolean(onlinePeople[selectedUserId]);

  const statusText = isTyping
    ? "typing..."
    : isOnline
      ? "Online"
      : isSocketConnected
        ? "Offline"
        : "Connecting...";

  return (
    <div className="absolute right-0 z-10 w-full rounded-lg bg-zinc-800 px-4 py-4 text-white">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="rounded-md p-1 hover:bg-zinc-700"
          onClick={() => setSelectedUserId(null)}
          aria-label="Back to users"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>

        <div className="ml-3 flex flex-1 items-center justify-between">
          <div>
            <p className="font-medium">{displayName}</p>
            <p className={`text-xs ${isTyping ? "text-blue-300" : "text-gray-300"}`}>{statusText}</p>
          </div>
          <span className={`h-3 w-3 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`} />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
