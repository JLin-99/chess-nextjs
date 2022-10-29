import { useContext, useEffect } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import {
  dropPiece,
  getInitialGame,
  getSquares,
  dragPiece,
  clearValidMovesClasses,
  makeMove,
} from "../context/chessboard/ChessboardActions";
import styles from "../styles/Chessboard.module.css";
import Square from "./Square";
import SocketContext from "../context/socket/SocketContext";

export default function Chessboard() {
  const { squares, activePiece, activeSquare, possibleMoves, chess, dispatch } =
    useContext(ChessboardContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const game = getInitialGame();
    dispatch({ type: "INITIALIZE_GAME", payload: game });

    dispatch({ type: "INITIALIZE_SQUARES", payload: getSquares(game) });

    socket.on("playerColor", (color) => {
      dispatch({ type: "SET_PLAYER_COLOR", payload: color });
    });

    socket.on("updateLocalGame", (fen) => {
      game.load(fen);

      dispatch({ type: "UPDATE_LOCAL_GAME", payload: game });
      dispatch({
        type: "UPDATE_SQUARES",
        payload: getSquares(game),
      });
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
        const res = makeMove(move);

        // Move it locally first and then send it to server
        chess.move(move);
        socket.emit("move", move);
        if (!res && possibleMoves) {
          let promotionPiece = "q";
          makeMove({ ...move, promotion: promotionPiece });
        }

        dispatch({
          type: "UPDATE_SQUARES",
          payload: getSquares(chess),
        });
      }
    }

    leavePiece();
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
