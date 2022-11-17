import { useContext, useEffect } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import {
  dropPiece,
  getInitialGame,
  getSquares,
  dragPiece,
  clearValidMovesClasses,
  makeMove,
  addCheckStyle,
  clearCheckStyle,
} from "../context/chessboard/ChessboardActions";
import styles from "../styles/Chessboard.module.css";
import Square from "./Square";
import SocketContext from "../context/socket/SocketContext";

export default function Chessboard() {
  const {
    squares,
    activePiece,
    activeSquare,
    possibleMoves,
    chess,
    playerColor,
    dispatch,
  } = useContext(ChessboardContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const game = getInitialGame();
    let socketColor;

    dispatch({ type: "INITIALIZE_GAME", payload: game });

    dispatch({
      type: "INITIALIZE_SQUARES",
      payload: getSquares(game, "w"),
    });

    socket.on("playerColor", (color) => {
      dispatch({ type: "SET_PLAYER_COLOR", payload: color });
      dispatch({
        type: "UPDATE_SQUARES",
        payload: getSquares(game, color),
      });
      socketColor = color;
    });

    socket.on("joinedGame", () => {
      dispatch({
        type: "UPDATE_SQUARES",
        payload: getSquares(game, socketColor),
      });
    });

    socket.on("updateLocalGame", (fen) => {
      game.load(fen);

      dispatch({ type: "UPDATE_LOCAL_GAME", payload: game });
      dispatch({
        type: "UPDATE_SQUARES",
        payload: getSquares(game, socketColor),
      });
    });

    socket.on("inCheck", (king) => {
      addCheckStyle(king);
    });

    socket.on("notInCheck", () => {
      console.log("notCheck");
      clearCheckStyle();
    });
  }, []);

  const handlePieceDrop = (e) => {
    if (!activePiece) return;

    let ladingTarget = e.target;

    if (ladingTarget.classList.contains(styles.piece)) {
      ladingTarget = ladingTarget.parentElement;
    }

    if (ladingTarget.classList.contains(styles.square)) {
      const move = { from: activeSquare.id, to: ladingTarget.id };

      if (possibleMoves.includes(ladingTarget)) {
        // Move it locally first and then send it to server
        const res = chess.move(move);
        socket.emit("move", move);

        // Pawn promotion
        if (!res && possibleMoves) {
          let promotionPiece = "q";
          makeMove({ ...move, promotion: promotionPiece });
        }

        dispatch({
          type: "UPDATE_SQUARES",
          payload: getSquares(chess, playerColor),
        });
      }
    }

    leavePiece();

    // if (chess.inCheck()) {
    //   console.log("jque");
    //   checkStyle(chess._turn + "k");
    // } else {
    //   clearCheckStyle();
    // }
  };

  const leavePiece = () => {
    if (!activePiece) return;

    dropPiece(activePiece);

    dispatch({ type: "CLEAR_ACTIVE_PIECE" });

    activeSquare.classList.remove(styles.activeSquare);
    dispatch({ type: "CLEAR_ACTIVE_SQUARE" });

    clearValidMovesClasses(possibleMoves);
    dispatch({ type: "CLEAR_POSSIBLE_MOVES" });
  };

  return (
    <div
      className={styles.chessboard}
      onMouseMove={(e) => {
        activePiece && dragPiece(e, activePiece);
      }}
      onMouseUp={handlePieceDrop}
      onMouseLeave={leavePiece}
    >
      {squares.map((sqr) => (
        <Square key={sqr.coord} sqr={sqr} />
      ))}
    </div>
  );
}
