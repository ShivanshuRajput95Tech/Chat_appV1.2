import { useState } from "react";
import Sidebar from "./Sidebar";
import Conversations from "./Conversations";
import ChatArea from "../chat/ChatArea";

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationsOpen, setConversationsOpen] = useState(true);

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-zinc-800 p-2 rounded-lg"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 transition-transform duration-300`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Conversations */}
      <div
        className={`${
          conversationsOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-20 lg:left-0 z-30 transition-transform duration-300`}
      >
        <Conversations onToggle={() => setConversationsOpen(!conversationsOpen)} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 lg:flex-1">
        <ChatArea />
      </div>

      {/* Overlay for mobile */}
      {(sidebarOpen || conversationsOpen) && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => {
            setSidebarOpen(false);
            setConversationsOpen(false);
          }}
        />
      )}
    </div>
  );
}