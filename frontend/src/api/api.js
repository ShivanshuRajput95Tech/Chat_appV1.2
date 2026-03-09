const API_URL = "http://localhost:4000/api";

export const registerUser = async(data) => {

    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    return res.json();

};

export const loginUser = async(data) => {

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    return res.json();

};
export const getUnreadCounts = async() => {

    const res = await fetch(`${API_URL}/messages/unread/counts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    return res.json();

};
export const uploadImage = async(file) => {

    try {

        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("http://localhost:4000/api/upload/image", {
            method: "POST",
            body: formData
        })

        if (!res.ok) {
            throw new Error("Upload failed")
        }

        return await res.json()

    } catch (err) {
        console.error("Upload error:", err)
    }

};