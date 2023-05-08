const { Server } = require("socket.io");
//connect with client

const io = new Server({
  cors: "http://localhost:5173",
});
let onlineUsers = [];
io.on("connection", (socket) => {
  console.log("new connection", socket.id);
  //listen to a connection
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    console.log("online users", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });
  //add message
  socket.on("sendMessage", (message) => {
    // io.emit("getMessage", message);
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    const sender = onlineUsers.find((user) => user.userId === message.senderId);
    console.log(message);
    console.log("user target", user);
    console.log("user target", sender);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(sender?.socketId).emit("getMessage", message);
    } else {
      io.emit("getMessage", message);
    }
  });
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3000);
