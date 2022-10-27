import { useContext, useState } from "react";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Login.module.css";

export default function Login({ setActiveGame }) {
  const [username, setUsername] = useState("");
  const [activeOption, setActiveOption] = useState("");

  const { dispatch } = useContext(SocketContext);

  const createNewGame = (e) => {
    if (!username) {
      return;
    }

    dispatch({ type: "SET_USERNAME", payload: username });
    setActiveOption("CreateGame");
  };

  const joinGame = (e) => {
    if (!username) {
      return;
    }

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
              <input type="text" value="19823748971" />
              <button>Copy!</button>
            </div>

            <p>Waiting for your opponent to join...</p>
            <button onClick={() => setActiveGame(true)}>start!</button>
          </>
        )}

        {activeOption === "JoinGame" && (
          <>
            <div>
              <label>Paste code here!</label>
              <input type="text" value="" />
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
