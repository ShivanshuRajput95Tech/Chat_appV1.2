/* Utility functions for the chat app */

/* -------- TIME FORMAT -------- */

export const formatMessageTime = (date) => {

    if (!date) return ""

    const d = new Date(date)

    if (Number.isNaN(d.getTime())) return ""

    return d.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit"
    })

}


/* -------- DATE FORMAT -------- */

export const formatMessageDate = (date) => {

    if (!date) return ""

    const d = new Date(date)

    if (Number.isNaN(d.getTime())) return ""

    const today = new Date()
    const yesterday = new Date()

    yesterday.setDate(today.getDate() - 1)

    if (d.toDateString() === today.toDateString()) return "Today"

    if (d.toDateString() === yesterday.toDateString()) return "Yesterday"

    return d.toLocaleDateString()

}


/* -------- TEXT HELPERS -------- */

export const truncateText = (text = "", maxLength = 50) => {

    if (typeof text !== "string") return ""

    if (text.length <= maxLength) return text

    return text.slice(0, maxLength) + "..."

}


/* -------- INITIALS -------- */

export const getInitials = (name = "") => {

    const parts = name.trim().split(/\s+/).filter(Boolean)

    if (!parts.length) return "?"

    return parts
        .slice(0, 2)
        .map(p => p[0])
        .join("")
        .toUpperCase()

}


/* -------- DEBOUNCE -------- */

export const debounce = (fn, wait = 300) => {

    let timeout

    return function(...args) {

        const context = this

        clearTimeout(timeout)

        timeout = setTimeout(() => {
            fn.apply(context, args)
        }, wait)

    }

}


/* -------- THROTTLE -------- */

export const throttle = (fn, limit = 300) => {

    let inThrottle = false

    return function(...args) {

        const context = this

        if (!inThrottle) {

            fn.apply(context, args)

            inThrottle = true

            setTimeout(() => {
                inThrottle = false
            }, limit)

        }

    }

}