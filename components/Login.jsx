import { useState } from "react";
import styles from "../styles/Login.module.css";

export default function Login({ setActiveGame }) {
  const [user, setUser] = useState("");
  const [activeOption, setActiveOption] = useState("");

  const createNewGame = (e) => {
    e.preventDefault();
    if (!user) {
      console.log("choose a username");
      return;
    }

    setActiveOption("CreateGame");

    // TODO: Create new game in server
    // setActiveGame(true);
  };

  const joinGame = (e) => {
    e.preventDefault();
    if (!user) {
      console.log("choose a username");
      return;
    }

    setActiveOption("JoinGame");

    // TODO: Join in game
    // setActiveGame(true);
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
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
            </div>
            <div className={styles.options}>
              <button onClick={createNewGame} disabled={!user}>
                Create New Game!
              </button>
              <button onClick={joinGame} disabled={!user}>
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
