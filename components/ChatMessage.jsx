import { useContext, useEffect, useState } from "react";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Chat.module.css";
import pieces from "../context/piecesPath.js";
import ChessboardContext from "../context/chessboard/ChessboardContext";

export default function ChatMessage({
  message,
  lastUsername,
  setLastUsername,
}) {
  const { socket, opponentId } = useContext(SocketContext);
  const [sameUser, setSameUser] = useState(false);
  const { playerColor } = useContext(ChessboardContext);
  const [showTime, setShowtime] = useState(false);

  useEffect(() => {
    if (message.type === "userChat" && message.author === lastUsername) {
      setSameUser(true);
    } else {
      setSameUser(false);
      setLastUsername(message.author);
    }
  }, []);

  return message.type === "userChat" ? (
    <div
      className={`${styles.msg} ${
        message.authorId != socket.id ? styles.leftMsg : styles.rightMsg
      }`}
      onMouseOver={() => setShowtime(true)}
      onMouseLeave={() => setShowtime(false)}
    >
      <div
        className={styles.msgImg}
        style={
          !sameUser
            ? {
                backgroundImage: `url(${
                  message.authorId == socket.id
                    ? pieces[playerColor + "K"].src
                    : message.authorId == opponentId &&
                      pieces[(playerColor === "w" ? "b" : "w") + "K"].src
                })`,
                alignSelf: "start",
              }
            : { height: "2rem", textAlign: "center" }
        }
      >
        {sameUser && showTime && message.time}
      </div>
      <div className={`${styles.msgBubble} ${sameUser && styles.msgSameUser}`}>
        {!sameUser && (
          <div className={styles.msgInfo}>
            <div className={styles.msgInfoName}>{message.author}</div>
            <div className={styles.msgInfoTime}>{message.time}</div>
          </div>
        )}
        <div className={styles.msgText}>{message.message}</div>
      </div>
    </div>
  ) : (
    <div className={styles.infoMsg}>{message.message}</div>
  );
}
