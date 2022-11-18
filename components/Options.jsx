import { useContext, useEffect, useState } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/Options.module.css";

export default function Options() {
  const { socket } = useContext(SocketContext);
  const { playerColor } = useContext(ChessboardContext);
  const [whitePlayerTime, setWhitePlayerTime] = useState(0);
  const [blackPlayerTime, setBlackPlayerTime] = useState(0);
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

  useEffect(() => {
    let interval = null;

    if (turn) {
      interval = setInterval(() => {
        turn === "w"
          ? setWhitePlayerTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
          : setBlackPlayerTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        turn === "b"
          ? setBlackPlayerTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
          : setWhitePlayerTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [turn]);

  return (
    <div className={styles.container}>
      {playerColor === "b" ? (
        <>
          <h3>
            WTimer:{" "}
            {`${("0" + (Math.floor(whitePlayerTime / 60) % 60)).slice(-2)}:${(
              "0" +
              (whitePlayerTime % 60)
            ).slice(-2)}`}
          </h3>
          <h3>
            bTimer:{" "}
            {`${("0" + (Math.floor(blackPlayerTime / 60) % 60)).slice(-2)}:${(
              "0" +
              (blackPlayerTime % 60)
            ).slice(-2)}`}
          </h3>
        </>
      ) : (
        <>
          <h3>
            bTimer:{" "}
            {`${("0" + (Math.floor(blackPlayerTime / 60) % 60)).slice(-2)}:${(
              "0" +
              (blackPlayerTime % 60)
            ).slice(-2)}`}
          </h3>
          <h3>
            WTimer:{" "}
            {`${("0" + (Math.floor(whitePlayerTime / 60) % 60)).slice(-2)}:${(
              "0" +
              (whitePlayerTime % 60)
            ).slice(-2)}`}
          </h3>
        </>
      )}
    </div>
  );
}
