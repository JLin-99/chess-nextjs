import { useContext } from "react";
import ChessboardContext from "../context/ChessboardContext";
import { dragPiece, getValidMovesNodes } from "../context/ChessboardActions";
import styles from "../styles/Chessboard.module.css";

export default function Piece({ piece }) {
  const { dispatch } = useContext(ChessboardContext);

  const handleMouseDown = (e) => {
    const pieceNode = e.target;
    const validMoves = getValidMovesNodes(pieceNode.parentElement.id);

    if (validMoves.length !== 0) {
      pieceNode.parentElement.classList.toggle(styles.activeSquare);
      dragPiece(e);
      dispatch({ type: "SET_ACTIVE_PIECE", payload: pieceNode });
      dispatch({ type: "SET_ACTIVE_SQUARE", payload: pieceNode.parentElement });
      dispatch({
        type: "SET_POSSIBLE_MOVES",
        payload: validMoves,
      });
    }
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
