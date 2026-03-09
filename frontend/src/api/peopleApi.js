import api from "./axios";

/* ---------------- GET PEOPLE ---------------- */

export const getPeople = async() => {
    try {
        const res = await api.get("/api/user/people");
        return res.data;
    } catch (error) {
        let message = "Failed to fetch people";
        if (error && error.response && error.response.data) {
            const data = error.response.data;
            if (typeof data === "object" && data.message) {
                message = data.message;
            } else if (typeof data === "string") {
                message = data;
            }
        } else if (error && error.message) {
            message = error.message;
        }
        console.error("Failed to fetch people:", message);
        throw new Error(message);
    }
};