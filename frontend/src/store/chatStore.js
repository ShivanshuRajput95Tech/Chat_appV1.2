import { create } from "zustand"
import { getMessages } from "../api/messageApi"
import { getSocket } from "../sockets/socket"

export const useChatStore = create((set, get) => ({

    /* ---------------- STATE ---------------- */

    messages: [],
    onlineUsers: [],
    selectedUser: null,
    typingUser: null,
    loading: false,

    currentChatRequest: null,


    /* ---------------- SELECT USER ---------------- */

    setSelectedUser: async(id) => {

        set({
            selectedUser: id,
            messages: []
        })

        if (id) {
            await get().loadMessages(id)
        }

    },


    /* ---------------- LOAD MESSAGES ---------------- */

    loadMessages: async(userId) => {

        if (!userId) return

        const requestId = Date.now()

        set({
            loading: true,
            currentChatRequest: requestId
        })

        try {

            const data = await getMessages(userId)

            /* Prevent race condition */

            if (get().currentChatRequest !== requestId) return

            const messages = Array.isArray(data) ? data : []

            set({
                messages,
                loading: false
            })

        } catch (error) {

            console.error("Failed to load messages:", error)

            set({
                loading: false,
                messages: []
            })

        }

    },


    /* ---------------- SET MESSAGES ---------------- */

    setMessages: (msgs) =>
        set({
            messages: Array.isArray(msgs) ? msgs : []
        }),


    /* ---------------- ADD MESSAGE ---------------- */

    addMessage: (msg) =>
        set((state) => {

            if (!msg) return state

            const exists = state.messages.some(
                (m) => m._id === msg._id
            )

            if (exists) return state

            return {
                messages: [...state.messages, msg]
            }

        }),


    /* ---------------- REPLACE TEMP MESSAGE ---------------- */

    replaceTempMessage: (tempId, realMessage) =>
        set((state) => ({

            messages: state.messages.map((m) =>
                m._id === tempId ? realMessage : m
            )

        })),


    /* ---------------- SEND MESSAGE ---------------- */

    sendMessage: (text, currentUserId) => {

        const state = get()

        const trimmedText = text ? .trim()

        if (!trimmedText || !currentUserId || !state.selectedUser) return

        const socket = getSocket()

        if (!socket) {
            console.error("Socket not connected")
            return
        }

        const tempId = `temp_${Date.now()}_${Math.random()}`

        const tempMessage = {
            _id: tempId,
            senderId: currentUserId,
            recipientId: state.selectedUser,
            text: trimmedText,
            createdAt: new Date(),
            pending: true
        }

        get().addMessage(tempMessage)

        socket.emit("sendMessage", {
            recipient: state.selectedUser,
            text: trimmedText,
            tempId
        })

    },


    /* ---------------- ONLINE USERS ---------------- */

    setOnlineUsers: (users) =>
        set({
            onlineUsers: Array.isArray(users) ? users : []
        }),


    /* ---------------- TYPING ---------------- */

    setTypingUser: (user) =>
        set({ typingUser: user }),

    clearTyping: () =>
        set({ typingUser: null }),


    /* ---------------- SEEN ---------------- */

    markSeen: (id) =>
        set((state) => ({

            messages: state.messages.map((m) =>
                m._id === id ? {...m, seen: true } : m
            )

        }))

}))