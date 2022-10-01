import { useContext } from "react";
import ChessboardContext from "../context/ChessboardContext";

export default function Chessboard() {
  const { squares } = useContext(ChessboardContext);
  return (
    <div>
      {squares.map((e) => (
        <h1 key={e.coord}>{e.coord}</h1>
      ))}
    </div>
  );
}
