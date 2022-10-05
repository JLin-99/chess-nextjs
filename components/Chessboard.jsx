import { useContext, useEffect } from "react";
import ChessboardContext from "../context/ChessboardContext";
import {
  dropPiece,
  getSquares,
  dragPiece,
  clearValidMovesClasses,
  mapSquares,
  makeMove,
  validMoves,
} from "../context/ChessboardActions";
import styles from "../styles/Chessboard.module.css";
import Square from "./Square";

export default function Chessboard() {
  const { squares, activePiece, activeSquare, possibleMoves, dispatch } =
    useContext(ChessboardContext);

  useEffect(() => {
    dispatch({ type: "INITIALIZE_SQUARES", payload: getSquares() });
  }, []);

  const handlePieceDrop = (e) => {
    if (!activePiece) return;

    let ladingTarget = e.target;
    console.log(ladingTarget);
    if (ladingTarget.classList.contains(styles.piece)) {
      ladingTarget = ladingTarget.parentElement;
    }

    if (ladingTarget.classList.contains(styles.square)) {
      const move = { from: activeSquare.id, to: ladingTarget.id };

      if (possibleMoves.includes(ladingTarget)) {
        if (makeMove(move)) {
          dispatch({
            type: "MOVE_PIECE",
            payload: mapSquares(squares, move),
          });
        } else if (validMoves(move.from)) {
          console.log(validMoves(move.from));
          makeMove({ ...move, promotion: "q" });
        }
      }
    }
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
    >
      {squares.map((sqr) => (
        <Square key={sqr.coord} sqr={sqr} />
      ))}
    </div>
  );
}
