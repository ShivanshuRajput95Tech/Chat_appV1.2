import { memo, useEffect, useRef } from "react"
import Message from "./Message"

const VirtualizedMessageList = memo(({ messages = [], onReaction, user }) => {

    const bottomRef = useRef(null)

    /* Auto scroll to latest message */

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length])

    if (!messages.length) {
        return (
            <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
                No messages yet
            </div>
        )
    }

    return (

        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">

            {messages.map((message, index) => {

                const senderId =
                    message?.senderId || message?.sender?._id

                const isOwn = senderId === user?._id

                return (
                    <Message
                        key={message._id || index}
                        message={message}
                        isOwn={isOwn}
                        onReaction={onReaction}
                        user={user}
                    />
                )
            })}

            <div ref={bottomRef} />

        </div>
    )

})

VirtualizedMessageList.displayName = "VirtualizedMessageList"

export default VirtualizedMessageList