import axios from "axios"
import { baseUrl } from "../apiConfig"

const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true
})

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config

})

export default api