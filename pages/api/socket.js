import { Server } from "socket.io";
import gameLogicHandler from "../../utils/sockets/server/gameLogicHandler";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    console.log("new connection " + socket.id);
    gameLogicHandler(io, socket);
  };

  io.on("connection", onConnection);

  console.log("Setting up server socket");
  res.end();
}
