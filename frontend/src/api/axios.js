import axios from "axios"
import { baseUrl } from "../apiConfig"

const api = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    timeout: 10000
})

// Request deduplication cache
const pendingRequests = new Map()

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    // Deduplication: abort identical pending requests
    const requestKey = `${config.method}_${config.url}`
    if (pendingRequests.has(requestKey)) {
        config.cancelToken = pendingRequests.get(requestKey).token
    } else {
        const source = axios.CancelToken.source()
        pendingRequests.set(requestKey, { source, config })
        config.cancelToken = source.token
    }

    return config

})

api.interceptors.response.use(
    (response) => {
        const requestKey = `${response.config.method}_${response.config.url}`
        pendingRequests.delete(requestKey)
        return response
    },
    (error) => {
        if (error.config) {
            const requestKey = `${error.config.method}_${error.config.url}`
            pendingRequests.delete(requestKey)
        }
        return Promise.reject(error)
    }
)

export default api