import { useContext, useEffect, useState } from "react";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Chat.module.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const { socket, username } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("privateMessage", (message) => {
      setMessages((currentMsgs) => [
        ...currentMsgs,
        { author: socket.id, message: message },
      ]);
    });

    socket.on("publicMessage", (message) => {
      setMessages((currentMsgs) => [
        ...currentMsgs,
        { author: socket.id, message: message },
      ]);
    });
  }, [socket]);

  useEffect(() => {
    if (username) socket.emit("setUsername", username);
  }, [username]);

  return (
    <div className={styles.container}>
      <h2>User: {username}</h2>
      <h3>Server messages:</h3>
      <button
        onClick={(e) => {
          e.preventDefault();
          socket.emit("greetEveryone");
        }}
      >
        Say Hello to Everyone
      </button>
      <ul className={styles.messages}>
        {messages.map((msg, i) => {
          return (
            <li key={i}>
              {msg.author}: {msg.message}
            </li>
          );
        })}
      </ul>
      <form className={styles.chatForm}>
        <input id="input" autoComplete="off" />
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log("click");
            socket.emit("privateMessage");
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}