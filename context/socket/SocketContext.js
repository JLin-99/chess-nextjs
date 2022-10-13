import { createContext } from "react";

const SocketContext = createContext();

export const SocketProvider = ({ socket, children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
