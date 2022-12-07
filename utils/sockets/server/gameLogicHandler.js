import { Chess } from "chess.js";
const gamesInSession = {};

export default (io, socket) => {
  const disconnectFromGame = () => {
    if (socket.gameId) {
      const index = gamesInSession[socket.gameId].users
        .map((user) => user.id)
        .indexOf(socket.id);

      gamesInSession[socket.gameId].users.splice(index, 1);

      if (!gamesInSession[socket.gameId].users.length) {
        delete gamesInSession[socket.gameId];
      }

      socket.gameId = null;
    }
  };

  const createNewGame = (username) => {
    // One game per socket
    if (socket.gameId) {
      disconnectFromGame();
    }

    let gameId =
      socket.id.substring(0, 5) + ("" + Date.now()).slice(-5) + "-GAME";
    socket.gameId = gameId;

    gamesInSession[gameId] = {
      chess: new Chess(),
      users: [createUser(socket.id, username, "w")],
      playAgainConfirmations: 0,
    };

    socket.join(gameId);
    io.to(socket.id).emit("gameCode", gameId);
    io.to(socket.id).emit("playerColor", "w");
  };

  const joinGame = (gameId, username) => {
    if (!gamesInSession[gameId]) {
      io.to(socket.id).emit("alert", "Wrong game ID, try again");
      return;
    }

    const users = gamesInSession[gameId].users;

    if (socket.gameId) {
      io.to(socket.id).emit("alert", "Already in " + socket.gameId + " game");
      return;
    }

    if (users.length >= 2) {
      io.to(socket.id).emit("alert", "Full Lobby");
      return;
    }

    users.length && users[0].color === "w"
      ? users.push(createUser(socket.id, username, "b"))
      : users.push(createUser(socket.id, username, "w"));

    io.to(socket.id).emit(
      "playerColor",
      users[users.map((user) => user.id).indexOf(socket.id)].color
    );

    users.forEach((user) => {
      io.to(user.id).emit(
        "opponentData",
        users.filter((opponent) => opponent.id !== user.id)[0]
      );
    });

    socket.gameId = gameId;
    if (!gamesInSession[socket.gameId].timer) {
      gamesInSession[socket.gameId].timer = {
        lastTimestamp: new Date().getTime(),
        w: 600,
        b: 600,
        turn: gamesInSession[socket.gameId].chess._turn,
      };
    }

    checkTimer();
    socket.join(gameId);
    io.to(gameId).emit("joinedGame");
    io.to(gameId).emit("timeLeft", gamesInSession[socket.gameId].timer);
    io.to(socket.gameId).emit(
      "updateLocalGame",
      gamesInSession[gameId].chess.fen()
    );
  };

  const makeMove = (move) => {
    const chess = gamesInSession[socket.gameId].chess;

    const isLegal = chess.move(move);
    if (isLegal) {
      socket.broadcast.to(socket.gameId).emit("moveMadeByOpponent");
    }

    checkTimer();

    io.to(socket.gameId).emit("updateLocalGame", chess.fen());

    if (chess.inCheck()) {
      io.to(socket.gameId).emit("inCheck", chess._turn + "k");
      if (!chess.isCheckmate()) {
        io.to(socket.gameId).emit("chatMessage", {
          author: socket.gameId,
          message: `${
            chess._turn === "b" ? "Black" : "White"
          } player is in check`,
          type: "chessInfo",
        });
      }
    } else {
      io.to(socket.gameId).emit("notInCheck");
    }

    if (chess.isGameOver() || chess.isDraw() || chess.isStalemate()) {
      io.to(socket.gameId).emit("gameOver", getGameOverStatus(chess));
    }
  };

  const checkTimer = () => {
    const chess = gamesInSession[socket.gameId].chess;
    const timer = gamesInSession[socket.gameId].timer;

    updateTimer(timer, chess);
    io.to(socket.gameId).emit("timeLeft", timer);

    if (!timer.w || !timer.b) {
      const gameOver = { type: "Time Out" };
      if (chess.isInsufficientMaterial()) {
        gameOver.winner = "tie";
      } else {
        gameOver.winner = !timer.w ? "b" : "w";
      }

      io.to(socket.gameId).emit("gameOver", gameOver);
    }
  };

  const playAgain = () => {
    const game = gamesInSession[socket.gameId];
    game.playAgainConfirmations++;

    if (game.playAgainConfirmations === 2) {
      game.chess.reset();
      game.timer = {
        lastTimestamp: new Date().getTime(),
        w: 600,
        b: 600,
        turn: gamesInSession[socket.gameId].chess._turn,
      };
      game.playAgainConfirmations = 0;
      game.users.forEach(
        (user) => (user.color = user.color === "w" ? "b" : "w")
      );

      game.users.forEach((user) =>
        io.to(user.id).emit("playerColor", user.color)
      );

      io.to(socket.gameId).emit("updateLocalGame", game.chess.fen());
      io.to(socket.gameId).emit("timeLeft", game.timer);
      io.to(socket.gameId).emit("gameOver", {});
      io.to(socket.gameId).emit("notInCheck");
      io.to(socket.gameId).emit("chatMessage", {
        author: "Server",
        authorId: socket.gameId,
        message: "New game started",
        type: "chessInfo",
      });
      io.to(socket.gameId).emit("gameRestarted");
    }
  };

  socket.on("disconnect", disconnectFromGame);
  socket.on("disconnectFromGame", disconnectFromGame);
  socket.on("createNewGame", createNewGame);
  socket.on("joinGame", joinGame);
  socket.on("checkTimer", checkTimer);
  socket.on("playAgain", playAgain);

  socket.on("move", makeMove);
};

function createUser(id, username, color) {
  return { id, username, color };
}

function updateTimer(timer, chess) {
  const time = new Date().getTime();
  const totalTimeUsed = (time - timer.lastTimestamp) / 1000;
  const timeLeft = timer[timer.turn] - totalTimeUsed;

  timer.lastTimestamp = time;
  timer[timer.turn] = timeLeft >= 0 ? timeLeft : 0;
  timer.turn = chess._turn;
}

function getGameOverStatus(chess) {
  const gameOver = { winner: "tie" };
  switch (true) {
    case chess.isCheckmate():
      gameOver.type = "Checkmate";
      gameOver.winner = chess._turn === "w" ? "b" : "w";
      break;
    case chess.isInsufficientMaterial():
      gameOver.type = "Insufficient Material";
      break;
    case chess.isDraw():
      gameOver.type = "50-move rule";
      break;
    case chess.isStalemate():
      gameOver.type = "Stalemate";
      break;
    default:
      break;
  }
  return gameOver;
}
