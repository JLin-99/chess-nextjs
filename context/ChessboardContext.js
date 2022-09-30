import { createContext, useState } from "react";

const ChessboardContext = createContext();

export const ChessboardProvider = ({ children }) => {
  const [squares, setSquares] = useState([
    { coord: "a8", color: "d" },
    { coord: "a8", color: "d" },
  ]);

  return (
    <ChessboardContext.Provider
      value={{
        squares,
      }}
    >
      {children}
    </ChessboardContext.Provider>
  );
};

export default ChessboardContext;
