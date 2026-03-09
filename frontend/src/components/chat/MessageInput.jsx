import { useState, useRef, useEffect } from "react";
import { sendMessage, startTyping, stopTyping } from "../../websocket/socket";
import { uploadImage } from "../../api/api";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

export default function MessageInput({ recipientId }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();
  const fileRef = useRef();
  const typingTimeoutRef = useRef();

  const send = () => {
    if (!text.trim()) return;
    const messageData = {
      receiverId: recipientId,
      message: text,
    };
    sendMessage(messageData);
    setText("");
    stopTyping(recipientId);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    if (recipientId) {
      startTyping(recipientId);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(recipientId);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      if (res && res.url) {
        sendMessage({
          receiverId: recipientId,
          message: res.url, // Assuming it's an image URL
        });
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  return (
    <div className="p-4 border-t border-zinc-700 flex gap-3 relative items-end bg-zinc-800/50 backdrop-blur-sm">
      <button
        onClick={() => setShowEmoji(!showEmoji)}
        className="text-xl hover:bg-zinc-700 p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95"
      >
        😀
      </button>

      <input
        type="file"
        ref={fileRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      <button
        onClick={() => fileRef.current.click()}
        disabled={uploading}
        className="text-xl hover:bg-zinc-700 p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50"
      >
        {uploading ? "⏳" : "📎"}
      </button>

      {showEmoji && (
        <div className="absolute bottom-16 left-0 z-10 animate-fade-in">
          <EmojiPicker
            onEmojiClick={(emoji) => {
              setText((prev) => prev + emoji.emoji);
              inputRef.current.focus();
            }}
            theme="dark"
          />
        </div>
      )}

      <input
        ref={inputRef}
        value={text}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        className="flex-1 bg-zinc-700/50 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 border border-zinc-600 focus:border-indigo-500"
      />

      <button
        onClick={send}
        disabled={!text.trim()}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-5 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        Send
      </button>
    </div>
  );
}