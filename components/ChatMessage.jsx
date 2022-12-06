import { useContext } from "react";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Chat.module.css";
import pieces from "../context/piecesPath.js";
import ChessboardContext from "../context/chessboard/ChessboardContext";

export default function ChatMessage({ message }) {
  const { socket, username, opponentId } = useContext(SocketContext);
  const { playerColor } = useContext(ChessboardContext);
  const date = new Date();

  const getImage = () => {};
  return message.type === "userChat" ? (
    <div
      className={`${styles.msg} ${
        message.authorId != socket.id ? styles.leftMsg : styles.rightMsg
      }`}
    >
      <div
        className={styles.msgImg}
        style={{
          backgroundImage: `url(${
            message.authorId == socket.id
              ? pieces[playerColor + "K"].src
              : message.authorId == opponentId &&
                pieces[(playerColor === "w" ? "b" : "w") + "K"].src
          })`,
        }}
      ></div>
      <div className={styles.msgBubble}>
        <div className={styles.msgInfo}>
          <div className={styles.msgInfoName}>{message.author}</div>
          <div
            className={styles.msgInfoTime}
          >{`${date.getHours()}:${date.getMinutes()}`}</div>
        </div>
        <div className={styles.msgText}>{message.message}</div>
      </div>
    </div>
  ) : (
    <div className={styles.infoMsg}>{message.message}</div>
  );
}
