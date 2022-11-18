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
      chess: new Chess(),
      users: [createUser(socket.id, "w")],
    };

    socket.join(gameId);
    io.to(socket.id).emit("gameCode", gameId);
    io.to(socket.id).emit("playerColor", "w");
  };

  const joinGame = (gameId) => {
    if (!gamesInSession[gameId]) {
      io.to(socket.id).emit("alert", "Wrong game ID, try again");
      return;
    }

    const users = gamesInSession[gameId].users;

    if (socket.gameId) {
      console.log("Already in " + socket.gameId + " game");
      io.to(socket.id).emit("alert", "Already in " + socket.gameId + " game");
      return;
    }

    if (users.length >= 2) {
      console.log("Full Lobby");
      io.to(socket.id).emit("alert", "Full Lobby");
      return;
    }

    users.length && users[0].color === "w"
      ? users.push(createUser(socket.id, "b"))
      : users.push(createUser(socket.id, "w"));

    io.to(socket.id).emit(
      "playerColor",
      users[users.map((user) => user.user).indexOf(socket.id)].color
    );

    socket.gameId = gameId;
    gamesInSession[socket.gameId].timer = {
      lastTimestamp: new Date().getTime(),
      w: 600,
      b: 600,
      turn: gamesInSession[socket.gameId].chess._turn,
    };

    socket.join(gameId);
    io.to(gameId).emit("joinedGame");
    io.to(gameId).emit("timeLeft", gamesInSession[socket.gameId].timer);
    console.log("games in session", gamesInSession);
  };

  const makeMove = (move) => {
    const chess = gamesInSession[socket.gameId].chess;

    chess.move(move);
    console.log(chess.ascii());
    updateTimer(gamesInSession[socket.gameId]);
    io.to(socket.gameId).emit("timeLeft", gamesInSession[socket.gameId].timer);
    if (
      !gamesInSession[socket.gameId].timer.w ||
      !gamesInSession[socket.gameId].timer.b
    ) {
      if (chess.insufficientMaterial()) {
        io.to(socket.gameId).emit("gameOver", { result: "tie" });
      } else {
        io.to(socket.gameId).emit("gameOver", {
          result: !gamesInSession[socket.gameId].timer.w ? "b" : "w",
        });
      }
    }

    io.to(socket.gameId).emit("updateLocalGame", chess.fen());

    if (chess.inCheck()) {
      io.to(socket.gameId).emit("inCheck", chess._turn + "k");
    } else {
      io.to(socket.gameId).emit("notInCheck");
    }
  };

  socket.on("disconnect", disconnectFromGame);
  socket.on("disconnectFromGame", disconnectFromGame);
  socket.on("createNewGame", createNewGame);
  socket.on("joinGame", joinGame);

  socket.on("move", makeMove);
};

function createUser(id, color) {
  return { user: id, color, timeLeft: 600 };
}

function updateTimer(game) {
  const time = new Date().getTime();
  const timer = game.timer;
  const totalTimeUsed = (time - timer.lastTimestamp) / 1000;
  const timeLeft = timer[timer.turn] - totalTimeUsed;

  timer.lastTimestamp = time;
  timer[timer.turn] = timeLeft >= 0 ? timeLeft : 0;
  timer.turn = game.chess._turn;
}
