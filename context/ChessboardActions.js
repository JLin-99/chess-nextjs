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
          img: pieces[piece.color + piece.type.toUpperCase()],
        };
      }

      squares.push(square);
    });
  });

  return squares;
};
