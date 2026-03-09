import { create } from "zustand"

import { loginUser, registerUser, getProfile } from "../api/authApi"
import { STORAGE_KEYS } from "../constants"
import { disconnectSocket } from "../sockets/socket"


const getStoredUser = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.USER)
        return stored ? JSON.parse(stored) : null
    } catch {
        return null
    }
}


export const useAuthStore = create((set) => ({

    user: getStoredUser(),
    loading: false,
    initialized: false,


    /* Login */

    login: async(data) => {

        set({ loading: true })

        try {

            const res = await loginUser(data)

            const { user, token } = res.data

            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
            localStorage.setItem(STORAGE_KEYS.TOKEN, token)

            set({
                user,
                loading: false
            })

            return true

        } catch (err) {

            console.error(
                "Login failed:",
                err ? .response ? .data || err ? .message
            )

            set({ loading: false })

            return false

        }

    },


    /* Register */

    register: async(data) => {

        set({ loading: true })

        try {

            await registerUser(data)

            set({ loading: false })

            return true

        } catch (err) {

            console.error(
                "Register failed:",
                err ? err.response ? err.data || err ? err.message : err.message : "Unknown error"
            )

            set({ loading: false })

            return false

        }

    },


    /* Check authentication on startup */

    checkAuth: async() => {

        set({ loading: true })

        try {

            const res = await getProfile()

            const user = res.data

            localStorage.setItem(
                STORAGE_KEYS.USER,
                JSON.stringify(user)
            )

            set({
                user,
                loading: false,
                initialized: true
            })

        } catch {

            if (
                import.meta.env.DEV) {

                const devUser = {
                    _id: "dev-user",
                    firstName: "Developer",
                    lastName: ""
                }

                localStorage.setItem(
                    STORAGE_KEYS.USER,
                    JSON.stringify(devUser)
                )

                set({
                    user: devUser,
                    loading: false,
                    initialized: true
                })

                return
            }

            localStorage.removeItem(STORAGE_KEYS.USER)

            set({
                user: null,
                loading: false,
                initialized: true
            })

        }

    },


    /* Logout */

    logout: () => {

        disconnectSocket()

        localStorage.removeItem(STORAGE_KEYS.USER)
        localStorage.removeItem(STORAGE_KEYS.TOKEN)

        set({
            user: null
        })

    }

}))