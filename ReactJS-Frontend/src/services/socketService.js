import { io } from 'socket.io-client';

const SOCKET_BASE = import.meta.env.VITE_SOCKET_BASE || 'http://localhost:5001';

const socket = io(SOCKET_BASE, {
  transports: ['websocket'],
  autoConnect: true,
});

export default socket;
