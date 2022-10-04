import { useContext, useEffect } from "react";
import ChessboardContext from "../context/ChessboardContext";
import { getSquares, movePiece } from "../context/ChessboardActions";
import styles from "../styles/Chessboard.module.css";
import Square from "./Square";

export default function Chessboard() {
  const { squares, activePiece, dispatch } = useContext(ChessboardContext);

  useEffect(() => {
    dispatch({ type: "INITIALIZE_SQUARES", payload: getSquares() });
  }, []);

  return (
    <div
      className={styles.chessboard}
      onMouseMove={(e) => {
        activePiece && movePiece(e, activePiece);
      }}
    >
      {squares.map((sqr) => (
        <Square key={sqr.coord} sqr={sqr} />
      ))}
    </div>
  );
}
