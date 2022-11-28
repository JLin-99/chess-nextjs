const socketReducer = (state, action) => {
  switch (action.type) {
    case "SET_USERNAME":
      state.socket.emit("setUsername", action.payload);
      return { ...state, username: action.payload };
    case "SET_OPPONENT_USERNAME":
      return { ...state, opponentUsername: action.payload };
    default:
      return state;
  }
};

export default socketReducer;
