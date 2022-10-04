import { useContext } from "react";
import ChessboardContext from "../context/ChessboardContext";
import { grabPiece } from "../context/ChessboardActions";
import styles from "../styles/Chessboard.module.css";

export default function Piece({ piece }) {
  const { dispatch } = useContext(ChessboardContext);

  return (
    <div
      style={{
        backgroundImage: `url(${piece.img})`,
      }}
      className={styles.piece}
      onMouseDown={(e) => {
        dispatch({ type: "SET_ACTIVE_PIECE", payload: grabPiece(e) });
      }}
    ></div>
  );
}
