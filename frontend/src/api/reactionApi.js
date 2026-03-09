import api from "./axios";

/* ---------------- ADD REACTION ---------------- */

export const addReaction = async(messageId, emoji) => {

    if (!messageId || !emoji) {
        throw new Error("Message ID and emoji are required");
    }

    try {

        const res = await api.post("/api/user/reaction", {
            messageId,
            emoji
        });

        return res.data;

    } catch (error) {

        let message = "Failed to add reaction";

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

        console.error("Failed to add reaction:", message);

        throw new Error(message);
    }
};