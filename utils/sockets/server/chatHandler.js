export default (io, socket) => {
  socket.on("setUsername", (username) => {
    socket.username = username;
    console.log(socket.id, socket.username);
  });

  socket.on("sendChatMessage", (message) => {
    io.to(socket.gameId).emit("chatMessage", message);
  });
};
