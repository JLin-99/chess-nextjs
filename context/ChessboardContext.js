import { createContext, useReducer } from "react";
import chessboardReducer from "./ChessboardReducer";

const ChessboardContext = createContext();

export const ChessboardProvider = ({ children }) => {
  const initialState = {
    squares: [],
    activePiece: null,
    activeSquare: null,
    possibleMoves: [],
  };

  const [state, dispatch] = useReducer(chessboardReducer, initialState);

  return (
    <ChessboardContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      {children}
    </ChessboardContext.Provider>
  );
};

export default ChessboardContext;
