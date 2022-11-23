const chessboardReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_GAME":
      return { ...state, chess: action.payload };
    case "UPDATE_LOCAL_GAME":
      return { ...state, chess: action.payload };
    case "INITIALIZE_SQUARES":
      return state.squares ? { ...state, squares: action.payload } : state;
    case "SET_PLAYER_COLOR":
      return { ...state, playerColor: action.payload };
    case "UPDATE_SQUARES":
      return { ...state, squares: action.payload };
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
    case "SET_GAME_OVER":
      return { ...state, gameOver: action.payload };
    default:
      return state;
  }
};

export default chessboardReducer;
