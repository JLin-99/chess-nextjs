import { useContext, useEffect, useState } from "react";
import ChessboardContext from "../context/chessboard/ChessboardContext";
import {
  dropPiece,
  getInitialGame,
  getSquares,
  dragPiece,
  clearValidMovesClasses,
  addCheckStyle,
  clearCheckStyle,
} from "../context/chessboard/ChessboardActions";
import styles from "../styles/Chessboard.module.css";
import Square from "./Square";
import Promotion from "./Promotion";
import SocketContext from "../context/socket/SocketContext";

export default function Chessboard() {
  const {
    squares,
    activePiece,
    activeSquare,
    possibleMoves,
    chess,
    playerColor,
    gameOver,
    dispatch,
  } = useContext(ChessboardContext);
  const { socket } = useContext(SocketContext);
  const [isPromotion, setIsPromotion] = useState(false);
  const [promotionMove, setPromotionMove] = useState(null);
  const dropSound = new Audio("https://www.fesliyanstudios.com/play-mp3/2910");
  const leavePieceSound = new Audio(
    "https://www.fesliyanstudios.com/play-mp3/5265"
  );
  // dropSound.src = "../public/assets/audio/pop_sound.wav";

  useEffect(() => {
    const game = getInitialGame();
    let socketColor;
    let checkSquareCoord = "";

    dispatch({ type: "INITIALIZE_GAME", payload: game });

    dispatch({
      type: "INITIALIZE_SQUARES",
      payload: getSquares(game, "w"),
    });

    socket.on("playerColor", (color) => {
      dispatch({ type: "SET_PLAYER_COLOR", payload: color });
      dispatch({
        type: "UPDATE_SQUARES",
        payload: getSquares(game, color),
      });
      socketColor = color;
    });

    socket.on("joinedGame", () => {
      dispatch({
        type: "UPDATE_SQUARES",
        payload: getSquares(game, socketColor),
      });
      new Audio("https://www.fesliyanstudios.com/play-mp3/5265").play();
    });

    socket.on("gameRestarted", () => {
      new Audio("https://www.fesliyanstudios.com/play-mp3/5265").play();
    });

    socket.on("updateLocalGame", (fen) => {
      game.load(fen);

      dispatch({ type: "UPDATE_LOCAL_GAME", payload: game });
      dispatch({
        type: "UPDATE_SQUARES",
        payload: getSquares(game, socketColor),
      });
    });

    socket.on("inCheck", (king) => {
      checkSquareCoord = addCheckStyle(king);
    });

    socket.on("notInCheck", () => {
      clearCheckStyle(checkSquareCoord);
    });

    socket.on("gameOver", (gameOverStatus) => {
      dispatch({ type: "SET_GAME_OVER", payload: gameOverStatus });
      const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/5249");
      audio.volume = 0.1;
      if (Object.keys(gameOverStatus).length !== 0) {
        if (socketColor !== gameOverStatus.winner) {
          audio.src = "https://www.fesliyanstudios.com/play-mp3/3111";
        } else {
          audio.src = "https://www.fesliyanstudios.com/play-mp3/5249";
        }
        audio.play();
      }
    });
  }, []);

  const handlePieceDrop = (e) => {
    if (!activePiece) return;

    let landingTarget = e.target;

    if (landingTarget.classList.contains(styles.piece)) {
      landingTarget = landingTarget.parentElement;
    }

    if (landingTarget.classList.contains(styles.square)) {
      const move = { from: activeSquare.id, to: landingTarget.id };

      if (
        possibleMoves.includes(landingTarget) &&
        !Object.keys(gameOver).length
      ) {
        // Move it locally first and then send it to server
        const res = chess.move(move);
        dropSound.play();

        // Pawn promotion
        if (!res && possibleMoves) {
          setIsPromotion(true);
          setPromotionMove(move);
          if (landingTarget.lastChild.classList.contains(styles.piece)) {
            landingTarget.lastChild.style.backgroundImage =
              activePiece.style.backgroundImage;
          } else {
            landingTarget.appendChild(activePiece.coneNode(true));
          }
          activePiece.style.display = "none";
        } else {
          socket.emit("move", move);
        }

        dispatch({
          type: "UPDATE_SQUARES",
          payload: getSquares(chess, playerColor),
        });
      }
    }

    leavePiece();
  };

  const leavePiece = () => {
    if (!activePiece) return;

    dropPiece(activePiece);

    dispatch({ type: "CLEAR_ACTIVE_PIECE" });

    activeSquare.classList.remove(styles.activeSquare);
    dispatch({ type: "CLEAR_ACTIVE_SQUARE" });

    clearValidMovesClasses(possibleMoves);
    dispatch({ type: "CLEAR_POSSIBLE_MOVES" });
  };

  return (
    <div className={styles.container}>
      {isPromotion && (
        <Promotion setIsPromotion={setIsPromotion} move={promotionMove} />
      )}
      <div
        className={styles.chessboard}
        onMouseMove={(e) => {
          activePiece && dragPiece(e, activePiece);
        }}
        onMouseUp={handlePieceDrop}
        onMouseLeave={leavePiece}
      >
        {squares.map((sqr) => (
          <Square key={sqr.coord} sqr={sqr} />
        ))}
      </div>
    </div>
  );
}
