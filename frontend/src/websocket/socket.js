import { io } from 'socket.io-client';

let socket;

export const connectSocket = (onMessage) => {
    const token = localStorage.getItem('token');
    socket = io('http://localhost:4000', {
        auth: {
            token: token
        }
    });

    socket.on('connect', () => {
        console.log('Connected to Socket.IO');
    });

    socket.on('receiveMessage', (data) => {
        if (onMessage) {
            onMessage(data);
        }
    });

    socket.on('onlineUsers', (users) => {
        if (onMessage) {
            onMessage({ type: 'online', users: users });
        }
    });

    socket.on('userTyping', (data) => {
        if (onMessage) {
            onMessage({ type: 'typing', senderId: data.senderId });
        }
    });

    socket.on('userStopTyping', (data) => {
        if (onMessage) {
            onMessage({ type: 'stopTyping', senderId: data.senderId });
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
};

export const sendMessage = (data) => {
    if (socket) {
        socket.emit('sendMessage', data);
    }
};

export const startTyping = (receiverId) => {
    if (socket) {
        socket.emit('typing', { receiverId });
    }
};

export const stopTyping = (receiverId) => {
    if (socket) {
        socket.emit('stopTyping', { receiverId });
    }
};