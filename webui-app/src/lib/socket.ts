import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initSocket = () => {
  if (!socket) {
    socket = io('http://localhost:8000');
  }
  return socket;
};

export const getSocket = () => socket;