import { useContext, useEffect, useState } from "react";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Login.module.css";

export default function Login({ setActiveGame }) {
  const [username, setUsername] = useState("");
  const [activeOption, setActiveOption] = useState("");
  const [gameCode, setGameCode] = useState("");

  const { socket, dispatch } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("gameCode", (code) => setGameCode(code));
  }, [socket]);

  const createNewGame = () => {
    if (!username) {
      return;
    }
    dispatch({ type: "SET_USERNAME", payload: username });

    socket.emit("createNewGame");

    setActiveOption("CreateGame");
  };

  const joinGame = () => {
    if (!username) {
      return;
    }
    setGameCode("");

    dispatch({ type: "SET_USERNAME", payload: username });
    setActiveOption("JoinGame");
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h1>Welcome to ChocoChess!!!</h1>

        {!activeOption && (
          <>
            <div className={styles.username}>
              <label>Choose your username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className={styles.options}>
              <button onClick={createNewGame} disabled={!username}>
                Create New Game!
              </button>
              <button onClick={joinGame} disabled={!username}>
                Join Game!
              </button>
            </div>
          </>
        )}

        {activeOption === "CreateGame" && (
          <>
            <div>
              <label>Send this code to your opponent!</label>
              <input type="text" value={gameCode} readOnly />
              <button>Copy!</button>
            </div>

            <p>Waiting for your opponent to join...</p>
            <div>
              <p>or</p>
              <button onClick={joinGame}>Join another Game!</button>
            </div>
          </>
        )}

        {activeOption === "JoinGame" && (
          <>
            <div>
              <label>Paste code here!</label>
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
              />
              <button>Join!</button>
            </div>
            <div>
              <p>or</p>
              <button onClick={createNewGame}>Create a new game!</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
