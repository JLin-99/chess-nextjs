import { createContext, useReducer } from "react";
import chessboardReducer from "./ChessboardReducer";

const ChessboardContext = createContext();
const initialSquares = (() => {
  const columns = "abcdefg".split("");
  console.log(columns);
})();

export const ChessboardProvider = ({ children }) => {
  const initialState = {
    squares: [
      { coord: "a8", type: "d" },
      { coord: "a7", type: "l" },
    ],
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
