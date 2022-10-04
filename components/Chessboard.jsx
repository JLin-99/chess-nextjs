import { useContext, useEffect } from "react";
import ChessboardContext from "../context/ChessboardContext";
import { dropPiece, getSquares, dragPiece } from "../context/ChessboardActions";
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

    const ladingTarget = e.target;

    if (ladingTarget.classList.contains(styles.square)) {
      console.log(
        `Trying "From: ${activeSquare.id} To: ${ladingTarget.id}" Square without piece`
      );
      console.log(possibleMoves);
    }

    // Verificar si es movimiento válido y actualizar la lista
    dropPiece(activePiece);

    dispatch({ type: "CLEAR_ACTIVE_PIECE" });
    dispatch({ type: "CLEAR_ACTIVE_SQUARE" });
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
