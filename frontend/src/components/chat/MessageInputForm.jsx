import React from "react";

const MessageInputForm = ({
  selectedUserId,
  newMessage,
  setNewMessage,
  sendMessage,
}) => {
  return (
    <>
      {selectedUserId && (
        <form onSubmit={sendMessage} className="relative m-4 w-full">
          <input
            type="text"
            id="message-input"
            className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-600 text-white placeholder-gray-400"
            placeholder="Your Message"
            value={newMessage}
            onChange={(ev) => setNewMessage(ev.target.value)}
            required
          />
          <button
            type="submit"
            className="absolute end-0 top-0 aspect-square h-full font-medium text-white hover:text-blue-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
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