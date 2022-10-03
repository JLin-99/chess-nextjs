import { useContext, useEffect } from "react";
import ChessboardContext from "../context/ChessboardContext";
import { getSquares } from "../context/ChessboardActions";
import styles from "../styles/Chessboard.module.css";
import Square from "./Square";

export default function Chessboard() {
  const { squares, dispatch } = useContext(ChessboardContext);

  useEffect(() => {
    dispatch({ type: "INITIALIZE_SQUARES", payload: getSquares() });
  }, []);

  return (
    <div className={styles.chessboard}>
      {squares.map((sqr) => (
        <Square key={sqr.coord} sqr={sqr} />
      ))}
    </div>
  );
}
