import api from "./axios";

/* --------- Generic request handler --------- */

const handleRequest = async(request) => {
    try {
        const res = await request();
        return res.data;
    } catch (error) {
        const message =
            (error && error.response && error.response.data && error.response.data.message) ||
            (error && error.message) ||
            "API request failed";

        console.error("API Error:", message);
        throw message;
    }
};

/* ---------------- LOGIN ---------------- */

export const loginUser = (data) =>
    handleRequest(() => api.post("/api/user/login", data));

/* ---------------- REGISTER ---------------- */

export const registerUser = (data) =>
    handleRequest(() => api.post("/api/user/register", data));

/* ---------------- PROFILE ---------------- */

export const getProfile = () =>
    handleRequest(() => api.get("/api/user/profile"));