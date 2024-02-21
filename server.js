// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let onlineUsers = [];

io.on('connection', (socket) => {
  // Handle user connections
  socket.on('join', (username) => {
    onlineUsers.push(username);
    io.emit('updateUsers', onlineUsers);
    socket.username = username;
    socket.broadcast.emit('message', `${username} joined`);
  });

  // Handle incoming messages
  socket.on('message', (messageData) => {
    io.emit('message', messageData);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter(user => user !== socket.username);
    io.emit('updateUsers', onlineUsers);
    socket.broadcast.emit('message', `${socket.username} left`);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
