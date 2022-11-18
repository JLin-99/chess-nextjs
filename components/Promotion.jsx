import { useContext } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Login.module.css";

export default function Login({ setIsPromotion, move }) {
  const { chess } = useContext(ChessboardContext);
  const { socket } = useContext(SocketContext);

  const handleClick = (piece) => {
    chess.move({ ...move, promotion: piece });
    socket.emit("move", { ...move, promotion: piece });
    setIsPromotion(false);
  };
  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <button onClick={() => handleClick("r")}>Rock</button>
        <button onClick={() => handleClick("b")}>Bishop</button>
        <button onClick={() => handleClick("n")}>Knight</button>
        <button onClick={() => handleClick("q")}>Queen</button>
      </div>
    </div>
  );
}
