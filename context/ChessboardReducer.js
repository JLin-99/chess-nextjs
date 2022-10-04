const chessboardReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_SQUARES":
      return state.squares ? { ...state, squares: action.payload } : state;
    case "SET_ACTIVE_PIECE":
      return { ...state, activePiece: action.payload };
    case "SET_ACTIVE_SQUARE":
      return { ...state, activeSquare: action.payload };
    case "SET_POSSIBLE_MOVES":
      return { ...state, possibleMoves: action.payload };
    case "CLEAR_ACTIVE_PIECE":
      return { ...state, activePiece: null };
    case "CLEAR_ACTIVE_SQUARE":
      return { ...state, activeSquare: null };
    case "CLEAR_ACTIVE_SQUARE":
      return { ...state, possibleMoves: [] };
    default:
      return state;
  }
};

export default chessboardReducer;
