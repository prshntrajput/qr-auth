import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL);
  }
  return socket;
};

export const getSocket = () => socket;
