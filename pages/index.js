import Head from "next/head";
import Chessboard from "../components/Chessboard";
import { ChessboardProvider } from "../context/chessboard/ChessboardContext";
import styles from "../styles/Home.module.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import Options from "../components/Options";
import Chat from "../components/Chat";
import { SocketProvider } from "../context/socket/SocketContext";
import Login from "../components/Login";
import Spinner from "../components/Spinner";

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [activeGame, setActiveGame] = useState(false);

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("api/socket");
    const socket = io();

    socket.on("connect", () => {
      setSocket(socket);
      console.log("Id:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });
  };

  return (
    <>
      <Head>
        <title>Chess Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!socket ? (
        <Spinner />
      ) : (
        <SocketProvider socket={socket} activeGame={activeGame}>
          {!activeGame && <Login setActiveGame={setActiveGame} />}
          <ChessboardProvider>
            <div
              className={`${styles.container} ${!activeGame && styles.blur}`}
            >
              <Options />
              <Chessboard />
              <Chat />
            </div>
          </ChessboardProvider>
        </SocketProvider>
      )}
    </>
  );
}
