import { useContext, useEffect, useState } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Chat.module.css";
import ChatMessage from "./ChatMessage";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { socket, username } = useContext(SocketContext);
  const { gameOver } = useContext(ChessboardContext);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("chatMessage", (msg) => {
      setMessages((currentMsgs) => [...currentMsgs, msg]);
    });
  }, [socket]);

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
      message,
      type: "userChat",
    });

    setMessage("");
  };

  return (
    <div className={styles.container}>
      <h2>Chat with your friend</h2>
      <ul className={styles.messages}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </ul>
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
