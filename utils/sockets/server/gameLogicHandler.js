import { Chess } from "chess.js";
const gamesInSession = {};

export default (io, socket) => {
  const disconnectFromGame = () => {
    if (socket.gameId) {
      const index = gamesInSession[socket.gameId].users.indexOf(socket.id);
      gamesInSession[socket.gameId].users.splice(index, 1);

      if (!gamesInSession[socket.gameId].users.length) {
        delete gamesInSession[socket.gameId];
      }

      socket.gameId = null;
    }
  };

  const createNewGame = () => {
    // One game per socket
    if (socket.gameId) {
      disconnectFromGame();
    }

    let gameId =
      socket.id.substring(0, 5) + ("" + Date.now()).slice(-5) + "-GAME";
    socket.gameId = gameId;

    gamesInSession[gameId] = {
      game: new Chess(),
      users: [socket.id],
    };

    socket.join(gameId);
    io.to(socket.id).emit("gameCode", gameId);

    console.log("Games in session: ", gamesInSession);
  };

  const joinGame = (gameId) => {
    if (!gamesInSession[gameId]) {
      io.to(socket.id).emit("alert", "Wrong game ID, try again");
      return;
    }

    if (socket.gameId) {
      console.log("Already in " + socket.gameId + " game");
      io.to(socket.id).emit("alert", "Already in " + socket.gameId + " game");
      return;
    }

    if (gamesInSession[gameId].users.indexOf(socket.id) != -1) {
      console.log("Already in this game session");
      io.to(socket.id).emit("alert", "Already in this game session");
      return;
    }

    if (gamesInSession[gameId].users.length >= 2) {
      console.log("Full lobby");
      io.to(socket.id).emit("alert", "Full Lobby");
      return;
    }

    gamesInSession[gameId].users.push(socket.id);
    socket.gameId = gameId;

    socket.join(gameId);
    io.to(gameId).emit("joinedGame");
    console.log("games in session", gamesInSession);
  };

  socket.on("disconnect", disconnectFromGame);
  socket.on("disconnectFromGame", disconnectFromGame);
  socket.on("createNewGame", createNewGame);
  socket.on("joinGame", joinGame);
};
