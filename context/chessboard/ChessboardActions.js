import { Chess } from "chess.js";
import pieces from "../piecesPath.js";
import styles from "../../styles/Chessboard.module.css";

const localChess = new Chess();
export const getInitialGame = () => new Chess();

export const getSquares = (chess, playerColor) => {
  const squares = [];
  let board = chess.board();
  let rows = [...Array(8).keys()];
  let columns = "abcdefgh".split("");

  if (playerColor === "b") {
    rows.reverse();
    columns.reverse();
    board.reverse();
    board.forEach((row) => row.reverse());
  }

  board.forEach((row, rowIndex) => {
    row.forEach((piece, columnIndex) => {
      const square = {
        coord: columns[columnIndex] + (8 - rows[rowIndex]),
        color: (rowIndex % 2) - (columnIndex % 2) ? "b" : "w",
        piece: null,
      };

      if (piece) {
        square.piece = {
          type: piece.type,
          color: piece.color,
          img: pieces[piece.color + piece.type.toUpperCase()].src,
        };
      }

      squares.push(square);
    });
  });

  return squares;
};

export const validMoves = (move, chess) => {
  return chess.moves({ square: move, verbose: true });
};

export const getValidMovesNodes = (coord, chess) => {
  const moves = chess.moves({ square: coord, verbose: true });

  const validMovesNodes = moves.map((move) => {
    const square = document.getElementById(move.to);

    if (move.flags === "n" || move.flags === "b") {
      square.classList.add(styles.possibleMove);
    } else if (move.promotion) {
      square.classList.add(styles.promotionMove);
    } else {
      square.classList.add(styles.captureMove);
    }

    return square;
  });

  return validMovesNodes;
};

export const clearValidMovesClasses = (squareNodes) => {
  squareNodes.forEach((square) => {
    square.classList.remove(styles.possibleMove);
    square.classList.remove(styles.specialMove);
    square.classList.remove(styles.captureMove);
    square.classList.remove(styles.promotionMove);
  });
};

export const dragPiece = (e, pieceNode = e.target) => {
  pieceNode.style.position = "fixed";
  pieceNode.style.left = e.clientX - pieceNode.offsetWidth / 2 + "px";
  pieceNode.style.top = e.clientY - pieceNode.offsetHeight / 2 + "px";
  pieceNode.style.zIndex = 500;
};

export const dropPiece = (pieceNode) => {
  pieceNode.style.position = "absolute";
  pieceNode.style.left = "-0.4rem";
  pieceNode.style.top = "-0.4rem";
  pieceNode.style.zIndex = 0;
};

export const addCheckStyle = (king) => {
  const square = document.getElementById(king).parentElement;

  square.classList.add(styles.check);
  return square.id;
};

export const clearCheckStyle = (coord) => {
  if (!coord) return;
  const kingSquare = document.getElementById(coord);

  kingSquare.classList.remove(styles.check);
};
