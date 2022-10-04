const chessboardReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_SQUARES":
      return state.squares ? { ...state, squares: action.payload } : state;
    case "SET_ACTIVE_PIECE":
      return { ...state, activePiece: action.payload };
    case "SET_ACTIVE_SQUARE":
      return { ...state, activeSquare: action.payload };
    default:
      return state;
  }
};

export default chessboardReducer;
