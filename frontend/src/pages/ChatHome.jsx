import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatMessages from "../components/chat/ChatMessages";
import MessageInputForm from "../components/chat/MessageInputForm";
import Nav from "../components/chat/Nav";
import OnlineUsersList from "../components/chat/OnlineUserList";
import TopBar from "../components/chat/TopBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const socketUrl = "ws://localhost:4000";

const ChatHome = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const connectToWebSocket = () => {
    const ws = new WebSocket(socketUrl);
    ws.addEventListener("message", handleMessage);
    setWs(ws);
  };

  useEffect(() => {
    connectToWebSocket();
    ws?.addEventListener("close", () => {
      connectToWebSocket();
    });
  }, [user, selectedUserId]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedUserId) {
        try {
          const res = await axios.get(`/api/user/messages/${selectedUserId}`);
          setMessages(res.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchData();
  }, [selectedUserId]);

  useEffect(() => {
    axios.get("/api/user/people").then((res) => {
      const offlinePeopleArr = res?.data
        .filter((p) => p._id !== user?._id)
        .filter((p) => !onlinePeople[p._id]);
      const offlinePeopleWithAvatar = offlinePeopleArr.map((p) => ({
        ...p,
        avatarLink: p.avatarLink,
      }));
      setOfflinePeople(
        offlinePeopleWithAvatar.reduce((acc, p) => {
          acc[p._id] = p;
          return acc;
        }, {})
      );
    });
  }, [onlinePeople, user]);

  useEffect(() => {
    const handleRealTimeMessage = (event) => {
      const messageData = JSON.parse(event.data);
      if ("text" in messageData) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    };
    if (ws) {
      ws.addEventListener("message", handleRealTimeMessage);
    }
    return () => {
      if (ws) {
        ws.removeEventListener("message", handleRealTimeMessage);
      }
    };
  }, [ws, selectedUserId]);

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username, avatarLink }) => {
      if (userId !== user?._id) {
        people[userId] = {
          username,
          avatarLink,
        };
      }
    });
    setOnlinePeople(people);
  };

  const handleMessage = (ev) => {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  };

  const sendMessage = (ev) => {
    if (ev) ev.preventDefault();
    if (newMessage && selectedUserId && ws) {
      ws.send(JSON.stringify({ text: newMessage, recipient: selectedUserId }));
      setNewMessage("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessage,
          sender: user._id,
          recipient: selectedUserId,
          _id: Date.now(),
        },
      ]);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-zinc-900">
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
          />
        )}
        <ChatMessages
          messages={messages}
          userDetails={user}
          selectedUserId={selectedUserId}
        />
        <div className="absolute w-full bottom-0 flex justify-center">
          <MessageInputForm
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            selectedUserId={selectedUserId}
          />
        </div>
      </section>
    </div>
  );
};

export default ChatHome;