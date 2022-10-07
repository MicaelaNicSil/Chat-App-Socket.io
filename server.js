const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./public/utils/messages");

require("dotenv").config();

const { userJoin, getCurrentUser, userLeaves, getRoomUsers} = require("./public/utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const admin = 'Chat Bot';

//Run when client connects
io.on('connection', (socket) => {
   console.log(io.of("/").adapter);
   socket.on("joinRoom", ({username, room}) =>{
      const user = userJoin(socket.id, username, room);

      socket.join(user.room);

   //Welcomes users
   socket.emit('message', formatMessage(admin, 'Welcome to ChatCord!'));

  //Broadcasts when a user connects
   //emit to a specific room you have to put to(user.room)
   socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(admin, `${user.username} has joined the chat`)
      );

   //Send user and room info
   io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
   });
  });


   //Listen for Messages
   socket.on('chatMessage', (msg) => {
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit('message', formatMessage (user.username, msg));
   });

   //runs when an user leaves the chat room
   socket.on("disconnect", () => {
      const user = userLeaves(socket.id);

      if(user) {
        io.to(user.room).emit("message", formatMessage (admin, `${user.username} has left the chat`));

        //Send user and room info
        io.to(user.room).emit("roomUsers", {
         room: user.room,
         users: getRoomUsers(user.room),
      });
      }  
   });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));