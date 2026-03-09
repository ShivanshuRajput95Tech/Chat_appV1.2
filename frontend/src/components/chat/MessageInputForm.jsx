import React from "react";

const MessageInputForm = ({
  selectedUserId,
  newMessage,
  setNewMessage,
  sendMessage,
  isSocketConnected,
  onTyping,
  onBlur,
}) => {
  return (
    <>
      {selectedUserId && (
        <form onSubmit={sendMessage} className="relative m-4 w-full">
          <textarea
            id="message-input"
            rows={1}
            className="w-full resize-none rounded-xl border border-gray-600 bg-transparent px-4 py-3 pr-12 text-white placeholder-gray-400"
            placeholder={isSocketConnected ? "Type a message" : "Connecting..."}
            value={newMessage}
            onChange={(ev) => {
              setNewMessage(ev.target.value);
              onTyping?.();
            }}
            onBlur={onBlur}
            onKeyDown={(ev) => {
              if (ev.key === "Enter" && !ev.shiftKey) {
                ev.preventDefault();
                sendMessage();
              }
            }}
            required
            disabled={!isSocketConnected}
          />
          <button
            type="submit"
            className="absolute end-2 top-1/2 -translate-y-1/2 text-white transition hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!isSocketConnected}
            aria-label="Send message"
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
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12.73a59.769 59.769 0 0 1-18.216 9.605L6 12Z"
              />
            </svg>
          </button>
        </form>
      )}
    </>
  );
};

export default MessageInputForm;
