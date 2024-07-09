import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { useAppSelector } from "../redux/store";
import { ClientToServerEvents, ServerToClientEvents } from "./socketIO.types";

type SocketContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  setSocket: React.Dispatch<
    React.SetStateAction<Socket<
      ServerToClientEvents,
      ClientToServerEvents
    > | null>
  >;
};

type SocketProviderProps = {
  children: React.ReactNode;
};

const VITE_SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  setSocket: () => {},
});

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const user = useAppSelector((state) => state.user).currentUser;

  useEffect(function () {
    const newSocket = io(VITE_SOCKET_SERVER_URL!);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(
    function () {
      if (socket && user) {
        socket.emit("newUser", user?.id);
      }
    },
    [socket, user],
  );

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
}
