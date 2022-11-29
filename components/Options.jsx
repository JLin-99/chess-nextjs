import { useContext, useEffect, useState } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Options.module.css";
import PlayAgain from "./PlayAgain";
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

  return (
    <div className={styles.container}>
      {playerColor === "b" ? (
        <Timer
          username={opponentUsername}
          time={whitePlayerTime}
          playerColor={"w"}
        />
      ) : (
        <Timer
          username={opponentUsername}
          time={blackPlayerTime}
          playerColor={"b"}
        />
      )}

      {Object.keys(gameOver).length !== 0 && <PlayAgain gameOver={gameOver} />}

      {playerColor === "b" ? (
        <Timer username={username} time={blackPlayerTime} playerColor={"b"} />
      ) : (
        <Timer username={username} time={whitePlayerTime} playerColor={"w"} />
      )}
    </div>
  );
}
