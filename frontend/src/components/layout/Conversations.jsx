import { useState } from "react";

export default function Conversations({ onToggle }) {
  const users = ["Alice", "Bob", "Charlie"];
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(user => user.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-72 bg-zinc-850 border-r border-zinc-700 flex flex-col">
      <div className="p-4 text-lg font-semibold flex items-center justify-between bg-zinc-800/50">
        <span>Chats</span>
        <button
          onClick={onToggle}
          className="lg:hidden text-white hover:bg-zinc-700 p-1 rounded transition-colors duration-200"
        >
          ✕
        </button>
      </div>
      <div className="p-4">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-700 rounded px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.map((user, index) => (
          <div
            key={user}
            className="px-4 py-3 hover:bg-zinc-700 cursor-pointer border-b border-zinc-700 transition-all duration-200 hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold animate-pulse">
                {user[0]}
              </div>
              <div className="flex-1">
                <div className="font-medium">{user}</div>
                <div className="text-sm text-zinc-400 truncate">Last message preview...</div>
              </div>
              <div className="text-xs text-zinc-500">2m</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}