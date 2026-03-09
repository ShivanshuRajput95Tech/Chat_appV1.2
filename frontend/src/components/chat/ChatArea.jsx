import { useEffect, useState } from "react";
import { connectSocket } from "../../websocket/socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatArea() {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const selectedUser = "Alice"; // Placeholder

  useEffect(() => {
    connectSocket((data) => {
      if (data.type === "online") {
        setOnlineUsers(data.users);
      }
      if (data.senderId) {
        setMessages((prev) => [...prev, { ...data, status: 'delivered' }]); // Simulate delivered
        setIsTyping(false); // Stop typing when message received
      }
      if (data.type === "typing") {
        setIsTyping(true);
        // Auto-hide typing after 3 seconds
        setTimeout(() => setIsTyping(false), 3000);
      }
      if (data.type === "stopTyping") {
        setIsTyping(false);
      }
    });
  }, []);

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Chat Header */}
      <div className="p-4 border-b border-zinc-700 flex items-center gap-3 bg-zinc-800/50 backdrop-blur-sm">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold animate-pulse">
          {selectedUser[0]}
        </div>
        <div>
          <div className="font-medium">{selectedUser}</div>
          <div className="text-sm text-zinc-400 flex items-center gap-2">
            {isTyping ? (
              <div className="text-zinc-400 italic">Typing...</div>
            ) : onlineUsers.includes(selectedUser) ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                Offline
              </>
            )}
          </div>
        </div>
      </div>

      <MessageList messages={messages} isTyping={isTyping} selectedUser={selectedUser} />
      <MessageInput recipientId="507f1f77bcf86cd799439011" />
    </div>
  );
}