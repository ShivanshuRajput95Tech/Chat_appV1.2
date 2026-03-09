import api from "./axios";

/* ---------------- GET MESSAGES ---------------- */

export const getMessages = async(userId) => {

    if (!userId) {
        throw new Error("User ID is required to fetch messages");
    }

    try {

        const res = await api.get(`/api/user/messages/${userId}`);

        return res.data;

    } catch (error) {

        let message = "Failed to fetch messages";

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

        console.error("Failed to fetch messages:", message);

        throw new Error(message);
    }
};