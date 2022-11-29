import { useContext } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import SocketContext from "../context/socket/SocketContext";
import styles from "../styles/PlayAgain.module.css";

export default function PlayAgain({ gameOver }) {
  const { socket, username, opponentUsername } = useContext(SocketContext);
  const { playerColor } = useContext(ChessboardContext);

  const playAgain = (e) => {
    socket.emit("playAgain");
    e.target.textContent = "Waiting for the opponent...";
    e.target.disabled = true;
  };
  return (
    <div className={styles.container}>
      <h2>Game Over ({gameOver.type})</h2>
      {gameOver.winner === "tie" ? (
        <h2>Tie</h2>
      ) : (
        // TODO: Add opponent username to context
        <h2>
          Winner:{" "}
          {gameOver.winner === playerColor ? username : opponentUsername}
        </h2>
      )}
      <button onClick={playAgain}>Play Again!</button>
    </div>
  );
}
