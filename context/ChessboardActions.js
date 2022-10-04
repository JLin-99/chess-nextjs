import { Chess } from "chess.js";
import pieces from "./piecesPath.js";

const chess = new Chess();

export const getSquares = () => {
  const board = chess.board();
  const squares = [];
  const columns = "abcdefgh".split("");

  board.forEach((row, rowIndex) => {
    row.forEach((piece, columnIndex) => {
      const square = {
        coord: columns[columnIndex] + (8 - rowIndex),
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

export const movePiece = (e, pieceNode = e.target) => {
  pieceNode.style.position = "fixed";
  pieceNode.style.left = e.clientX - pieceNode.offsetWidth / 2 + "px";
  pieceNode.style.top = e.clientY - pieceNode.offsetHeight / 2 + "px";
};

export const dropPiece = (pieceNode) => {
  pieceNode.style.position = "absolute";
};
