export default (io, socket) => {
  socket.on("setUsername", (username) => {
    socket.username = username;
  });

  socket.on("sendChatMessage", (message) => {
    io.to(socket.gameId).emit("chatMessage", message);
  });
};
