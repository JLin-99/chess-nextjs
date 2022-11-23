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
      w: 12,
      b: 12,
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

    checkTimer();

    io.to(socket.gameId).emit("updateLocalGame", chess.fen());

    if (chess.inCheck()) {
      io.to(socket.gameId).emit("inCheck", chess._turn + "k");
    } else {
      io.to(socket.gameId).emit("notInCheck");
    }
  };

  const checkTimer = () => {
    const chess = gamesInSession[socket.gameId].chess;
    const timer = gamesInSession[socket.gameId].timer;

    updateTimer(timer, chess);
    io.to(socket.gameId).emit("timeLeft", timer);

    if (!timer.w || !timer.b) {
      if (chess.isInsufficientMaterial()) {
        io.to(socket.gameId).emit("gameOver", {
          type: "timeOut",
          winner: "tie",
        });
      } else {
        io.to(socket.gameId).emit("gameOver", {
          type: "timeOut",
          winner: !timer.w ? "b" : "w",
        });
      }
    }
  };

  socket.on("disconnect", disconnectFromGame);
  socket.on("disconnectFromGame", disconnectFromGame);
  socket.on("createNewGame", createNewGame);
  socket.on("joinGame", joinGame);
  socket.on("checkTimer", checkTimer);

  socket.on("move", makeMove);
};

function createUser(id, color) {
  return { user: id, color, timeLeft: 600 };
}

function updateTimer(timer, chess) {
  const time = new Date().getTime();
  const totalTimeUsed = (time - timer.lastTimestamp) / 1000;
  const timeLeft = timer[timer.turn] - totalTimeUsed;

  timer.lastTimestamp = time;
  timer[timer.turn] = timeLeft >= 0 ? timeLeft : 0;
  timer.turn = chess._turn;
}
