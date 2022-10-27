import { Chess } from "chess.js";
const gamesInSession = {};

export default (io, socket) => {
  const onDisconnect = () => {
    if (socket.gameId) {
      const index = gamesInSession[socket.gameId].users.indexOf(socket.id);
      gamesInSession[socket.gameId].users.splice(index, 1);

      if (!gamesInSession[socket.gameId].users.length) {
        delete gamesInSession[socket.gameId];
      }
    }
  };

  const createNewGame = () => {
    let gameId =
      socket.id.substring(0, 5) + ("" + Date.now()).slice(-5) + "-GAME";
    socket.gameId = gameId;

    gamesInSession[gameId] = {
      game: new Chess(),
      users: [socket.id],
    };

    io.to(socket.id).emit("gameCode", gameId);
    console.log("Game in session: ", gamesInSession);
  };

  socket.on("disconnect", onDisconnect);
  socket.on("createNewGame", createNewGame);
};
