import { useContext, useEffect, useState } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Options.module.css";
import Timer from "./Timer";

export default function Options() {
  const { socket, opponentUsername, username } = useContext(SocketContext);
  const { playerColor, gameOver } = useContext(ChessboardContext);
  const [whitePlayerTime, setWhitePlayerTime] = useState(600);
  const [blackPlayerTime, setBlackPlayerTime] = useState(600);
  const [turn, setTurn] = useState("");

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on("timeLeft", (playersTime) => {
      setWhitePlayerTime(Math.round(playersTime.w));
      setBlackPlayerTime(Math.round(playersTime.b));
      setTurn(playersTime.turn);
    });
  }, [socket]);

  // Chess Timer
  useEffect(() => {
    let interval = null;

    if (turn && !Object.keys(gameOver).length) {
      interval = setInterval(() => {
        turn === "w"
          ? setWhitePlayerTime((prevTime) => {
              if (prevTime > 0) {
                return prevTime - 1;
              } else {
                socket.emit("checkTimer");
                return 0;
              }
            })
          : setBlackPlayerTime((prevTime) => {
              if (prevTime > 0) {
                return prevTime - 1;
              } else {
                socket.emit("checkTimer");
                return 0;
              }
            });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [turn, gameOver]);

  const playAgain = (e) => {
    socket.emit("playAgain");
    e.target.textContent = "Waiting for the opponent...";
    e.target.disabled = true;
  };

  return (
    <div className={styles.container}>
      {playerColor === "w" ? (
        <Timer
          username={opponentUsername}
          time={blackPlayerTime}
          playerColor={"b"}
        />
      ) : (
        <Timer
          username={opponentUsername}
          time={whitePlayerTime}
          playerColor={"w"}
        />
      )}

      {Object.keys(gameOver).length !== 0 && (
        <div>
          <h2>Game Over: {gameOver.type}</h2>
          {gameOver.winner === "tie" ? (
            <h2>Tie</h2>
          ) : (
            // TODO: Add opponent username to context
            <h2>Winner: {gameOver.winner}</h2>
          )}
          <button onClick={playAgain}>Play Again!</button>
        </div>
      )}

      {playerColor === "w" ? (
        <Timer username={username} time={whitePlayerTime} playerColor={"w"} />
      ) : (
        <Timer username={username} time={blackPlayerTime} playerColor={"b"} />
      )}
    </div>
  );
}
