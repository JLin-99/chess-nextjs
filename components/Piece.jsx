import { useContext } from "react";
import ChessboardContext from "../context/ChessboardContext";
import {
  dragPiece,
  getValidMovesNodes,
  validMoves,
} from "../context/ChessboardActions";
import styles from "../styles/Chessboard.module.css";

export default function Piece({ piece }) {
  const { dispatch } = useContext(ChessboardContext);

  const handleMouseDown = (e) => {
    const pieceNode = e.target;
    const validMovesNodes = getValidMovesNodes(pieceNode.parentElement.id);

    if (validMovesNodes.length !== 0) {
      pieceNode.parentElement.classList.toggle(styles.activeSquare);
      dragPiece(e);
      dispatch({ type: "SET_ACTIVE_PIECE", payload: pieceNode });
      dispatch({ type: "SET_ACTIVE_SQUARE", payload: pieceNode.parentElement });
      dispatch({
        type: "SET_POSSIBLE_MOVES",
        payload: validMovesNodes,
      });
    }
  };

  const handleMouseEnter = (e) => {
    const pieceNode = e.target;
    if (validMoves(pieceNode.parentElement.id).length) {
      pieceNode.classList.add(styles.canGrab);
    } else {
      pieceNode.classList.remove(styles.canGrab);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${piece.img})`,
      }}
      className={styles.piece}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    ></div>
  );
}
