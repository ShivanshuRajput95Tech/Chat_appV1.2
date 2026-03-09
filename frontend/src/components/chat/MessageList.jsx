import { useEffect, useRef } from "react";
import Message from "./Message";

export default function MessageList({ messages, isTyping, selectedUser }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg, i) => (
        <div key={i} className="animate-fade-in">
          <Message {...msg} />
        </div>
      ))}

      {isTyping && (
        <div className="flex justify-start mb-3 animate-fade-in">
          <div className="px-4 py-2 rounded-xl bg-zinc-700 text-white flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm text-zinc-400">{selectedUser} is typing...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef}></div>
    </div>
  );
}