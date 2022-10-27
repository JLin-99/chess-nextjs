import { createContext, useReducer } from "react";
import socketReducer from "./SocketReducer";

const SocketContext = createContext();

export const SocketProvider = ({ socket, children }) => {
  const initialState = {
    socket,
    username: "",
  };

  const [state, dispatch] = useReducer(socketReducer, initialState);

  return (
    <SocketContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
