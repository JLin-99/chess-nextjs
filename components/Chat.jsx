import { useContext, useEffect, useRef, useState } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Chat.module.css";
import ChatMessage from "./ChatMessage";
import { IoMdChatboxes } from "react-icons/io";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [lastUsername, setLastUsername] = useState("");
  const { socket, username } = useContext(SocketContext);
  const { gameOver } = useContext(ChessboardContext);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("chatMessage", (msg) => {
      setMessages((currentMsgs) => [...currentMsgs, msg]);
    });
  }, [socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (username) socket.emit("setUsername", username);
  }, [username]);

  useEffect(() => {
    if (Object.keys(gameOver).length) {
      setMessages((currentMsgs) => [
        ...currentMsgs,
        {
          type: "chessInfo",
          message: `Game Over - ${gameOver.type} - ${
            gameOver.winner === "tie"
              ? "Tie"
              : gameOver.winner === "w"
              ? "White Player Wins"
              : "Black Player Wins"
          }`,
        },
      ]);
    }
  }, [gameOver]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message === "") return;

    socket.emit("sendChatMessage", {
      author: username,
      authorId: socket.id,
      message,
      time: `${("0" + new Date().getHours()).slice(-2)}:${(
        "0" + new Date().getMinutes()
      ).slice(-2)}`,
      type: "userChat",
    });

    setMessage("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <IoMdChatboxes />
      </div>
      <div className={styles.chat}>
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            message={msg}
            lastUsername={lastUsername}
            setLastUsername={setLastUsername}
          />
        ))}

        <div ref={bottomRef} />
      </div>
      <form className={styles.chatForm} onSubmit={handleSubmit}>
        <input
          id="input"
          type="text"
          autoComplete="off"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}
