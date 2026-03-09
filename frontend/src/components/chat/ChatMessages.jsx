import React, { useEffect, useMemo, useRef } from "react";

const ChatMessages = ({ messages, userDetails, selectedUserId }) => {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const normalizedMessages = useMemo(() => {
    return (messages || []).map((message) => ({
      ...message,
      createdAt: message.createdAt ? new Date(message.createdAt) : new Date(),
    }));
  }, [messages]);

  const isOwnMessage = (message) => {
    const senderId = typeof message.sender === "object" ? message.sender?._id : message.sender;
    return senderId === userDetails?._id;
  };

  return (
    <div className="absolute bottom-24 left-0 w-full overflow-y-auto px-4 lg:px-10" ref={messagesContainerRef}>
      {!!selectedUserId && (
        <div className="flex flex-col gap-2 pb-6 pt-20">
          {normalizedMessages.map((message) => {
            const own = isOwnMessage(message);
            return (
              <div
                key={message._id}
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm text-white shadow ${
                  own ? "self-end rounded-br-md bg-blue-700" : "self-start rounded-bl-md bg-blue-600"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
                <p className="mt-1 text-[10px] text-blue-200">
                  {message.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {selectedUserId && !messages.length && (
        <div className="flex items-end justify-center pt-28 text-gray-400">Start a conversation</div>
      )}
    </div>
  );
};

export default ChatMessages;
