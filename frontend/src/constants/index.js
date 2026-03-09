/* Environment */

const API_URL = (
    import.meta.env.VITE_API_URL || "").trim()
const SOCKET_URL_ENV = (
    import.meta.env.VITE_SOCKET_URL || "").trim()

const DEFAULT_LOCAL_URL = "http://localhost:7000"

/* Base URLs */

export const API_BASE_URL = API_URL || DEFAULT_LOCAL_URL
export const SOCKET_URL = SOCKET_URL_ENV || DEFAULT_LOCAL_URL


/* UI Colors */

export const COLORS = Object.freeze({
    primary: "bg-indigo-600",
    primaryHover: "hover:bg-indigo-700",

    secondary: "bg-slate-800",
    secondaryHover: "hover:bg-slate-700",

    success: "bg-green-600",
    successHover: "hover:bg-green-700",

    danger: "bg-red-600",
    dangerHover: "hover:bg-red-700"
})


/* Message Types */

export const MESSAGE_TYPES = Object.freeze({
    TEXT: "text",
    IMAGE: "image",
    FILE: "file"
})


/* Chat Types */

export const CHAT_TYPES = Object.freeze({
    DIRECT: "direct",
    GROUP: "group"
})


/* Local Storage Keys */

export const STORAGE_KEYS = Object.freeze({
    USER: "user",
    TOKEN: "token"
})


/* Pagination */

export const PAGINATION = Object.freeze({
    MESSAGES_PER_PAGE: 20,
    USERS_PER_PAGE: 50
})