import styles from "../styles/Chessboard.module.css";
import Piece from "./Piece";

export default function Square({ sqr }) {
  return (
    <div
      className={`${styles.square} ${
        sqr.color === "w" ? styles.whiteSquare : styles.blackSquare
      }`}
      id={sqr.coord}
    >
      <p>{sqr.coord}</p>
      {sqr.piece && <Piece piece={sqr.piece} />}
    </div>
  );
}
