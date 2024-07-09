import { useContext } from "react";

import { SocketContext } from "./SocketContext";

export function useSocket() {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("Socket referenced outside of its scope");
  }

  return context;
}
