export default (io, socket) => {
  socket.on("setUsername", (username) => {
    socket.username = username;
  });

  socket.on("privateMessage", () => {
    io.to(socket.id).emit("privateMessage", "testing " + socket.id);
  });

  socket.on("greetEveryone", () => {
    io.local.emit(
      "publicMessage",
      `${socket.id.substring(0, 5)} is saying hello to everyone`
    );
  });
};
