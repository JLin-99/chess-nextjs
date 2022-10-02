const chessboardReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_SQUARES":
      return state.squares ? { ...state, squares: action.payload } : state;
    default:
      return state;
  }
};

export default chessboardReducer;
