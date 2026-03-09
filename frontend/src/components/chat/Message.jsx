import { format } from 'timeago.js';

export default function Message({ text, mine, timestamp, isImage, status }) {
  const getStatusIcon = () => {
    if (!mine) return null;
    switch (status) {
      case 'sent':
        return <span className="text-zinc-400">✓</span>;
      case 'delivered':
        return <span className="text-zinc-400">✓✓</span>;
      case 'read':
        return <span className="text-blue-400">✓✓</span>;
      default:
        return <span className="text-zinc-500">○</span>; // sending
    }
  };

  return (
    <div className={`flex mb-3 ${mine ? "justify-end" : "justify-start"} animate-slide-in group`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-xs lg:max-w-md break-words transition-all duration-300 hover:scale-105 relative ${
          mine
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
            : "bg-zinc-700 text-white shadow-md hover:bg-zinc-600"
        }`}
      >
        {isImage ? (
          <img
            src={text}
            alt="Shared"
            className="max-w-full rounded transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div>{text}</div>
        )}
        <div className="flex items-center justify-between mt-1">
          {timestamp && (
            <div className="text-xs opacity-70">
              {format(timestamp)}
            </div>
          )}
          {mine && (
            <div className="text-xs opacity-70 ml-2">
              {getStatusIcon()}
            </div>
          )}
        </div>
        {/* Reaction placeholder */}
        <div className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="text-xs bg-zinc-800 rounded-full w-6 h-6 flex items-center justify-center hover:bg-zinc-700">
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
}