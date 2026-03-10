import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import ChatMessages from "../components/chat/ChatMessages";
import MessageInputForm from "../components/chat/MessageInputForm";
import Nav from "../components/chat/Nav";
import OnlineUsersList from "../components/chat/OnlineUserList";
import TopBar from "../components/chat/TopBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createGroup } from "../api/groupApi";

const socketUrl = "ws://localhost:4000";

const ChatHome = () => {
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectFnRef = useRef(() => {});
  const typingTimeoutRef = useRef(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const userId = user?._id;

  const normalizeIncomingMessage = useCallback((messageData) => {
    const id = messageData._id || messageData.id || Date.now();

    return {
      _id: id,
      text: messageData.text || "",
      sender: messageData.sender,
      recipient: messageData.recipient,
      createdAt: messageData.createdAt || new Date().toISOString(),
      clientTempId: messageData.clientTempId || null,
    };
  }, []);

  const showOnlinePeople = useCallback(
    (peopleArray = []) => {
      const people = {};

      peopleArray.forEach(({ userId: onlineUserId, username, avatarLink }) => {
        if (onlineUserId && onlineUserId !== userId) {
          people[onlineUserId] = { username, avatarLink };
        }
      });

      setOnlinePeople(people);
    },
    [userId]
  );

  const sendTypingState = useCallback(
    (isTyping) => {
      const ws = wsRef.current;
      if (!selectedUserId || !ws || ws.readyState !== WebSocket.OPEN) return;

      ws.send(
        JSON.stringify({
          type: "typing",
          recipient: selectedUserId,
          isTyping,
        })
      );
    },
    [selectedUserId]
  );

  const handleInputTyping = useCallback(() => {
    sendTypingState(true);

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingState(false);
    }, 1200);
  }, [sendTypingState]);

  const handleSocketMessage = useCallback(
    (event) => {
      const messageData = JSON.parse(event.data);

      if ("online" in messageData) {
        showOnlinePeople(messageData.online);
        return;
      }

      if (messageData.type === "online" && Array.isArray(messageData.users)) {
        showOnlinePeople(messageData.users);
        return;
      }

      if (messageData.type === "typing" && messageData.sender) {
        setTypingUsers((prev) => ({
          ...prev,
          [messageData.sender]: Boolean(messageData.isTyping),
        }));
        return;
      }

      if (!("text" in messageData)) return;

      const incomingMessage = normalizeIncomingMessage(messageData);

      setMessages((prev) => {
        if (incomingMessage.clientTempId) {
          const tempIndex = prev.findIndex((m) => m._id === incomingMessage.clientTempId);
          if (tempIndex >= 0) {
            const next = [...prev];
            next[tempIndex] = incomingMessage;
            return next;
          }
        }

        const alreadyExists = prev.some((m) => m._id === incomingMessage._id);
        if (alreadyExists) return prev;

        const shouldAppendForOpenThread =
          selectedUserId &&
          (incomingMessage.sender === selectedUserId || incomingMessage.recipient === selectedUserId);

        return shouldAppendForOpenThread ? [...prev, incomingMessage] : prev;
      });
    },
    [normalizeIncomingMessage, selectedUserId, showOnlinePeople]
  );

  const connectToWebSocket = useCallback(() => {
    if (!userId) return;
    if (wsRef.current && wsRef.current.readyState <= 1) return;

    const ws = new WebSocket(socketUrl);
    wsRef.current = ws;

    ws.addEventListener("open", () => setIsSocketConnected(true));
    ws.addEventListener("message", handleSocketMessage);

    ws.addEventListener("close", () => {
      setIsSocketConnected(false);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectFnRef.current();
      }, 2000);
    });

    ws.addEventListener("error", () => ws.close());
  }, [handleSocketMessage, userId]);

  useEffect(() => {
    reconnectFnRef.current = connectToWebSocket;
  }, [connectToWebSocket]);

  useEffect(() => {
    connectToWebSocket();

    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      clearTimeout(typingTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectToWebSocket]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUserId) return;
      try {
        const res = await axios.get(`/api/user/messages/${selectedUserId}`);
        setMessages(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUserId]);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const res = await axios.get("/api/user/people");
        const offlinePeopleArr = (res?.data || [])
          .filter((p) => p._id !== userId)
          .filter((p) => !onlinePeople[p._id]);

        setOfflinePeople(
          offlinePeopleArr.reduce((acc, p) => {
            acc[p._id] = p;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };

    fetchPeople();
  }, [onlinePeople, userId]);

  const sendMessage = useCallback(
    (ev) => {
      if (ev) ev.preventDefault();

      const text = newMessage.trim();
      const ws = wsRef.current;

      if (!text || !selectedUserId || !ws || ws.readyState !== WebSocket.OPEN || !userId) {
        return;
      }

      const clientTempId = `temp-${Date.now()}`;
      ws.send(JSON.stringify({ text, recipient: selectedUserId, clientTempId }));
      sendTypingState(false);

      const optimisticMessage = {
        text,
        sender: userId,
        recipient: selectedUserId,
        _id: clientTempId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setNewMessage("");
    },
    [newMessage, selectedUserId, sendTypingState, userId]
  );

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);


  const handleStartCall = useCallback(() => {
    if (!selectedUserId) return;
    toast.success("Calling feature UI started (RTC integration next step)");
  }, [selectedUserId]);

  const handleCreateGroup = useCallback(async () => {
    try {
      const name = window.prompt("Enter group name");
      if (!name) return;
      await createGroup({ name, members: [selectedUserId].filter(Boolean) });
      toast.success("Group created successfully");
    } catch (error) {
      toast.error(error.message || "Unable to create group");
    }
  }, [selectedUserId]);

  const selectedUser = useMemo(
    () => onlinePeople[selectedUserId] || offlinePeople[selectedUserId],
    [offlinePeople, onlinePeople, selectedUserId]
  );

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)", color: "var(--text-main)", transition: "background-color .2s ease" }}>
      <Nav />
      <OnlineUsersList
        onlinePeople={onlinePeople}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        offlinePeople={offlinePeople}
      />
      <section className="w-[71%] lg:w-[62%] relative pb-10">
        {selectedUserId && (
          <TopBar
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            offlinePeople={offlinePeople}
            onlinePeople={onlinePeople}
            isSocketConnected={isSocketConnected}
            selectedUser={selectedUser}
            isTyping={Boolean(typingUsers[selectedUserId])}
            onStartCall={handleStartCall}
            onCreateGroup={handleCreateGroup}
          />
        )}
        <ChatMessages messages={messages} userDetails={user} selectedUserId={selectedUserId} />
        <div className="absolute bottom-0 flex w-full justify-center">
          <MessageInputForm
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            selectedUserId={selectedUserId}
            isSocketConnected={isSocketConnected}
            onTyping={handleInputTyping}
            onBlur={() => sendTypingState(false)}
          />
        </div>
      </section>
    </div>
  );
};

export default ChatHome;
