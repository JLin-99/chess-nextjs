import styles from "../styles/Chessboard.module.css";

export default function Square({ sqr }) {
  return (
    <div
      className={sqr.color === "w" ? styles.whiteSquare : styles.blackSquare}
    >
      <p>{sqr.coord}</p>
      {sqr.piece && (
        <div
          style={{
            backgroundImage: `url(${sqr.piece.img.src})`,
            height: sqr.piece.img.height,
            width: sqr.piece.img.width,
          }}
        ></div>
      )}
    </div>
  );
}
