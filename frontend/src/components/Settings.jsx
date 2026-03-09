import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Settings({ onClose }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-xl w-full max-w-md text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-zinc-700 rounded px-3 py-2"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Profile</label>
            <div className="flex items-center gap-3">
              <img src="https://i.imgur.com/qGsYvAK.png" alt="Profile" className="w-12 h-12 rounded-full" />
              <div>
                <div className="font-medium">{user?.email || 'User'}</div>
                <div className="text-sm text-zinc-400">Online</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}