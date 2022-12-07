import { useContext, useEffect, useState } from "react";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Login.module.css";
import createBtn from "../public/assets/createBtn.png";
import joinBtn from "../public/assets/joinBtn.png";
import { FaCopy } from "react-icons/fa";
import { AiOutlineEnter } from "react-icons/ai";

export default function Login({ setActiveGame }) {
  const [username, setUsername] = useState("");
  const [activeOption, setActiveOption] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [alert, setAlert] = useState("");

  const { socket, dispatch } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("gameCode", (code) => setGameCode(code));
    socket.on("alert", (msg) => setAlert(msg));
    socket.on("joinedGame", () => setActiveGame(true));
    socket.on("opponentData", (opponent) => {
      dispatch({ type: "SET_OPPONENT_USERNAME", payload: opponent.username });
      dispatch({ type: "SET_OPPONENT_ID", payload: opponent.id });
    });
  }, [socket]);

  const createNewGame = () => {
    if (!username) {
      return;
    }
    dispatch({ type: "SET_USERNAME", payload: username });
    setActiveOption("CreateGame");

    socket.emit("createNewGame", username);
  };

  const joinGame = () => {
    if (!username) {
      return;
    }
    setGameCode("");

    dispatch({ type: "SET_USERNAME", payload: username });

    setActiveOption("JoinGame");

    // Delete existing game created by the user
    socket.emit("disconnectFromGame");
  };

  const joinExistingGame = (e) => {
    e.preventDefault();
    socket.emit("joinGame", gameCode, username);
  };

  const handleCopy = (e) => {
    navigator.clipboard.writeText(gameCode);
    // e.target.parent.style.borderColor = "green";
    document.getElementById("copy").style.color = "#DAE2B6";
    document.getElementById("gameCode").style.borderColor = "#DAE2B6";
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <h1>Welcome to ChocoChess!!!</h1>
        <div className={styles.container}>
          {!activeOption && (
            <>
              <div className={styles.inputForm}>
                <label>Choose your username:</label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.options}>
                <div
                  className={`${styles.btn} ${!username && styles.noHover}`}
                  onClick={joinGame}
                  disabled={!username}
                  style={{
                    backgroundImage: `url(${joinBtn.src})`,
                  }}
                >
                  <div className={styles.btnText}>Join Game!</div>
                </div>
                <div
                  className={`${styles.btn} ${!username && styles.noHover}`}
                  onClick={createNewGame}
                  disabled={!username}
                  style={{
                    backgroundImage: `url(${createBtn.src})`,
                  }}
                >
                  <div className={styles.btnText}>Create New Game!</div>
                </div>
              </div>
            </>
          )}

          {activeOption === "CreateGame" && (
            <>
              <div className={styles.inputForm}>
                <label>Send this code to your opponent!</label>
                <div className={styles.inputContainer} id="gameCode">
                  <input
                    type="text"
                    value={gameCode}
                    readOnly
                    className={styles.pl3}
                  />
                  <div
                    className={styles.iconBtn}
                    onClick={handleCopy}
                    id="copy"
                  >
                    <FaCopy />
                  </div>
                </div>
              </div>

              <p>Waiting for your opponent to join...</p>
              <p>or</p>
              <div className={styles.options}>
                <div
                  className={styles.btn}
                  onClick={joinGame}
                  style={{
                    backgroundImage: `url(${joinBtn.src})`,
                  }}
                >
                  <div className={styles.btnText}>Join Another Game!</div>
                </div>
              </div>
            </>
          )}

          {activeOption === "JoinGame" && (
            <>
              {/* <div>
                <label>Game code:</label>
                <input
                  type="text"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                />
                <button onClick={joinExistingGame}>Join!</button>
              </div>
              {alert && <div>{alert}</div>}
              <div>
                <p>or</p>
                <button onClick={createNewGame}>Create a new game!</button>
              </div> */}

              <form className={styles.inputForm} onSubmit={joinExistingGame}>
                <label>Game Code</label>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    className={styles.pl3}
                  />
                  <div className={styles.iconBtn} onClick={joinExistingGame}>
                    <AiOutlineEnter />
                  </div>
                </div>
                {alert && <div className={styles.alert}>{alert}</div>}
              </form>

              <p>or</p>
              <div className={styles.options}>
                <div
                  className={styles.btn}
                  onClick={createNewGame}
                  style={{
                    backgroundImage: `url(${createBtn.src})`,
                  }}
                >
                  <div className={styles.btnText}>Create New Game!</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
