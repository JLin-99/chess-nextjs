import { Server } from "socket.io";
import messageHandler from "../../utils/sockets/messageHandler";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    // console.log("server socket already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    console.log("new connection " + socket.id);
    messageHandler(io, socket);
  };

  io.on("connection", onConnection);

  console.log("Setting up server socket");
  res.end();
}
