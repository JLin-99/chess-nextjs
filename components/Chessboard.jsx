import { useContext, useEffect } from "react";
import ChessboardContext from "../context/ChessboardContext";
import { getSquares } from "../context/ChessboardActions";
import styles from "../styles/Chessboard.module.css";

export default function Chessboard() {
  const { squares, dispatch } = useContext(ChessboardContext);

  useEffect(() => {
    dispatch({ type: "INITIALIZE_SQUARES", payload: getSquares() });
  }, []);

  return (
    <div className={styles.chessboard}>
      {squares.map((sqr) => (
        <div
          className={
            sqr.color === "w" ? styles.whiteSquare : styles.blackSquare
          }
          key={sqr.coord}
        >
          <h1>{sqr.coord}</h1>
        </div>
      ))}
    </div>
  );
}
