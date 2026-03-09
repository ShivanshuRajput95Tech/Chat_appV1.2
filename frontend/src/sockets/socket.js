import { io } from "socket.io-client"
import { SOCKET_URL } from "../constants"

let socket = null
let currentUserId = null

export const connectSocket = (userId) => {

    if (!userId) {
        console.warn("Socket connection skipped: missing userId")
        return socket
    }

    /* Reuse existing connection */

    if (socket && currentUserId === userId) {
        return socket
    }

    /* Disconnect previous user */

    if (socket) {
        socket.removeAllListeners()
        socket.disconnect()
    }

    currentUserId = userId

    socket = io(SOCKET_URL, {

        autoConnect: true,

        withCredentials: true,

        auth: { userId },

        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000

    })

    /* Debug listeners */

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id)
    })

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason)
    })

    socket.on("reconnect", (attempt) => {
        console.log("Socket reconnected after", attempt, "attempts")
    })

    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message)
    })

    return socket

}

export const getSocket = () => socket

export const isSocketConnected = () => {
    return socket ? .connected || false
}

export const disconnectSocket = () => {

    if (!socket) return

    socket.removeAllListeners()

    socket.disconnect()

    socket = null
    currentUserId = null

    console.log("Socket manually disconnected")

}