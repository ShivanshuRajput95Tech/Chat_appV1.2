import api from "./axios";

/* ---------------- GET GROUPS ---------------- */

export const getGroups = async() => {
    try {

        const res = await api.get("/api/group");
        return res.data;

    } catch (error) {

        let message = "Failed to fetch groups";

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

        console.error("Failed to fetch groups:", message);

        throw new Error(message);
    }
};


/* ---------------- CREATE GROUP ---------------- */

export const createGroup = async(data) => {
    try {

        const res = await api.post("/api/group", data);
        return res.data;

    } catch (error) {

        let message = "Failed to create group";

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

        console.error("Failed to create group:", message);

        throw new Error(message);
    }
};