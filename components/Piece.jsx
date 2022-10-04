import { useContext } from "react";
import ChessboardContext from "../context/ChessboardContext";
import { movePiece } from "../context/ChessboardActions";
import styles from "../styles/Chessboard.module.css";

export default function Piece({ piece }) {
  const { dispatch } = useContext(ChessboardContext);

  const handleMouseDown = (e) => {
    const pieceNode = e.target;

    movePiece(e);
    dispatch({ type: "SET_ACTIVE_PIECE", payload: pieceNode });
    dispatch({ type: "SET_ACTIVE_SQUARE", payload: pieceNode.parentElement });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${piece.img})`,
      }}
      className={styles.piece}
      onMouseDown={handleMouseDown}
    ></div>
  );
}
