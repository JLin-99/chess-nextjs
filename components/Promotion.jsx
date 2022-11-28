import { useContext } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Promotion.module.css";
import pieces from "../context/piecesPath.js";
import Image from "next/image";

export default function Login({ setIsPromotion, move }) {
  const { chess, playerColor } = useContext(ChessboardContext);
  const { socket } = useContext(SocketContext);

  const handleClick = (piece) => {
    chess.move({ ...move, promotion: piece });
    socket.emit("move", { ...move, promotion: piece });
    setIsPromotion(false);
  };
  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h2>Promotion! Choose your piece</h2>
        <div className={styles.container}>
          <div onClick={() => handleClick("r")} className={styles.whiteSquare}>
            <Image src={pieces[playerColor + "R"].src} width={60} height={60} />
          </div>
          <div onClick={() => handleClick("b")} className={styles.blackSquare}>
            <Image src={pieces[playerColor + "B"].src} width={60} height={60} />
          </div>
          <div onClick={() => handleClick("n")} className={styles.whiteSquare}>
            <Image src={pieces[playerColor + "N"].src} width={60} height={60} />
          </div>
          <div onClick={() => handleClick("q")} className={styles.blackSquare}>
            <Image src={pieces[playerColor + "Q"].src} width={60} height={60} />
          </div>
        </div>
      </div>
    </div>
  );
}
