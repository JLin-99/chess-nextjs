const socketReducer = (state, action) => {
  switch (action.type) {
    case "SET_USERNAME":
      state.socket.emit("setUsername", action.payload);
      return { ...state, username: action.payload };
    default:
      return state;
  }
};

export default socketReducer;
