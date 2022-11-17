import { useContext } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import {
  dragPiece,
  getValidMovesNodes,
  validMoves,
} from "../context/chessboard/ChessboardActions";
import styles from "../styles/Chessboard.module.css";

export default function Piece({ piece }) {
  const { chess, playerColor, dispatch } = useContext(ChessboardContext);

  const handleMouseDown = (e) => {
    if (chess._turn !== playerColor) {
      return;
    }

    const pieceNode = e.target;
    const validMovesNodes = getValidMovesNodes(
      pieceNode.parentElement.id,
      chess
    );

    console.log(playerColor);

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
    if (
      chess._turn === playerColor &&
      validMoves(pieceNode.parentElement.id, chess).length
    ) {
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
      {...(piece.type === "k" ? { id: piece.color + piece.type } : {})}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    ></div>
  );
}
