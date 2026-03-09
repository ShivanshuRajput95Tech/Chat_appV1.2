import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Settings from "../Settings";

export default function Sidebar({ onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="w-20 bg-zinc-800 flex flex-col items-center py-5 gap-6 relative">
        <button
          onClick={onClose}
          className="md:hidden absolute top-2 right-2 text-white hover:bg-zinc-700 p-1 rounded transition-colors duration-200"
        >
          ✕
        </button>
        <div className="relative group">
          <img
            src="https://i.imgur.com/qGsYvAK.png"
            className="w-12 h-12 rounded-full transition-transform duration-300 hover:scale-110"
            alt="Profile"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 w-10 h-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg">
          +
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="bg-gradient-to-r from-zinc-600 to-zinc-500 hover:from-zinc-500 hover:to-zinc-400 w-10 h-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
          title="Settings"
        >
          ⚙️
        </button>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 w-10 h-10 rounded-xl text-lg transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
          title="Logout"
        >
          ↩
        </button>
      </div>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  );
}