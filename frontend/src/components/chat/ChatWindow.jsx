import { useState, useRef, useEffect, memo, useMemo, useCallback } from "react"
import Avatar from "../ui/Avatar"
import { useChatStore } from "../../store/chatStore"
import { useAuthStore } from "../../store/authStore"
import Message from "./Message"

const ChatWindow = memo(() => {

    const messages = useChatStore((s) => s.messages) || []
    const selectedUser = useChatStore((s) => s.selectedUser)
    const onlineUsers = useChatStore((s) => s.onlineUsers) || []
    const sendMessage = useChatStore((s) => s.sendMessage)

    const user = useAuthStore((s) => s.user)

    const [text, setText] = useState("")

    const bottomRef = useRef(null)

    /* Auto scroll */
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    /* Send message */
    const handleSend = useCallback(() => {

        const message = text.trim()

        if (!message || !selectedUser || !user?._id) return

        sendMessage({
            receiverId: selectedUser,
            text: message,
            senderId: user._id
        })

        setText("")

    }, [text, selectedUser, sendMessage, user])

    /* Enter key send */
    const handleKeyDown = useCallback((e) => {

        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }

    }, [handleSend])

    /* Header info */
    const chatInfo = useMemo(() => {

        if (!selectedUser) {
            return {
                name: "Select a user",
                avatar: "C",
                status: "Realtime messaging"
            }
        }

        const onlineUser = onlineUsers.find(u => u.userId === selectedUser)

        return {
            name: onlineUser?.username || "User",
            avatar: onlineUser?.username?.[0] || "U",
            status: onlineUser ? "online" : "offline"
        }

    }, [selectedUser, onlineUsers])

    /* Empty chat state */
    if (!selectedUser) {
        return (
            <div className="flex flex-1 items-center justify-center text-gray-400">
                Select a user to start chatting
            </div>
        )
    }

    return (

        <div className="flex flex-col flex-1">

            {/* Header */}

            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur">

                <div className="flex items-center gap-3">

                    <Avatar name={chatInfo.avatar} />

                    <div>
                        <div className="font-semibold">
                            {chatInfo.name}
                        </div>

                        <div className="text-xs text-gray-400">
                            {chatInfo.status}
                        </div>
                    </div>

                </div>

            </div>


            {/* Messages */}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {messages.length === 0 && (
                    <div className="text-center text-gray-500">
                        No messages yet
                    </div>
                )}

                {messages.map((msg) => (
                    <Message
                        key={msg._id || msg.id}
                        message={msg}
                        currentUser={user}
                    />
                ))}

                <div ref={bottomRef} />

            </div>


            {/* Input */}

            <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur flex items-center gap-3">

                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-800 px-4 py-2 rounded-lg outline-none"
                />

                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-5 py-2 rounded-lg transition"
                >
                    Send
                </button>

            </div>

        </div>
    )

})

ChatWindow.displayName = "ChatWindow"

export default ChatWindow