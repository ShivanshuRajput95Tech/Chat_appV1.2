import { useCallback } from "react"
import { useChatStore } from "../store/chatStore"
import { useAuthStore } from "../store/authStore"

export const useChat = () => {

    const user = useAuthStore((s) => s.user)
    const userId = user ? ._id || null

    const {
        messages,
        selectedUser,
        selectedGroup,
        onlineUsers,
        groups,
        sendMessage: storeSendMessage
    } = useChatStore((state) => ({
        messages: state.messages,
        selectedUser: state.selectedUser,
        selectedGroup: state.selectedGroup,
        onlineUsers: state.onlineUsers,
        groups: state.groups,
        sendMessage: state.sendMessage
    }))

    /* Send message wrapper */

    const sendMessage = useCallback((text) => {

        const message = text ? .trim()

        if (!message || !userId) return

        storeSendMessage({
            text: message,
            senderId: userId,
            receiverId: selectedUser,
            groupId: selectedGroup
        })

    }, [storeSendMessage, userId, selectedUser, selectedGroup])


    /* Check message ownership */

    const isOwnMessage = useCallback((message) => {

        const senderId =
            message ? .senderId ||
            message ? .sender ? ._id

        return senderId === userId

    }, [userId])

    return {
        user,
        messages,
        selectedUser,
        selectedGroup,
        onlineUsers,
        groups,
        sendMessage,
        isOwnMessage
    }

}