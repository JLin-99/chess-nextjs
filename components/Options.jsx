import { useContext, useEffect } from "react";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Options.module.css";

export default function Options() {
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) {
      return;
    }
  }, [socket]);

  const createNewGame = () => {
    socket.emit("createNewGame");
  };

  return (
    <div className={styles.container}>
      <button onClick={createNewGame}>Create New Game</button>
      <form>
        <label>Join Game:</label>
        <input type="text" />
        <input type="submit" value="Join!" />
      </form>
    </div>
  );
}
