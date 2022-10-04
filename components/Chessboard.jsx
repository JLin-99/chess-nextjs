import { useContext, useEffect } from "react";
import ChessboardContext from "../context/ChessboardContext";
import { dropPiece, getSquares, movePiece } from "../context/ChessboardActions";
import styles from "../styles/Chessboard.module.css";
import Square from "./Square";

export default function Chessboard() {
  const { squares, activePiece, activeSquare, dispatch } =
    useContext(ChessboardContext);

  useEffect(() => {
    dispatch({ type: "INITIALIZE_SQUARES", payload: getSquares() });
  }, []);

  const handlePieceDrop = (e) => {
    if (!activePiece) return;

    const landingSquare = e.target;
    console.log(landingSquare.id);

    dropPiece(activePiece);
    dispatch({ type: "CLEAR_ACTIVE_PIECE", payload: activePiece });
    dispatch({ type: "CLEAR_ACTIVE_SQUARE", payload: activeSquare });
  };

  return (
    <div
      className={styles.chessboard}
      onMouseMove={(e) => {
        activePiece && movePiece(e, activePiece);
      }}
      onMouseUp={handlePieceDrop}
    >
      {squares.map((sqr) => (
        <Square key={sqr.coord} sqr={sqr} />
      ))}
    </div>
  );
}
