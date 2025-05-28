import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
const API_URL = import.meta.env.VITE_API_URL;

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
    img?: string;
  };
}

export function useMessageSocket(roomId: string, userId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log(roomId, userId)
    if (!roomId || !userId) return;

    const socketIo = io(`${API_URL}/messages`, {
      autoConnect: false,
    });

    setSocket(socketIo);

    socketIo.connect();

    socketIo.on('connect', () => {
      setIsConnected(true);
      console.log(`Socket conectado: ${socketIo.id}`);
      socketIo.emit('joinRoom', { roomId });
    });

    socketIo.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket desconectado');
    });

    socketIo.on('messageReceived', (message: Message) => {
      console.log('Mensagem recebida pelo socket:', message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketIo.emit('leaveRoom', { roomId });
      socketIo.disconnect();
      setMessages([]);
      setIsConnected(false);
    };
  }, [roomId, userId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !isConnected) {
        console.warn('Socket não conectado, não pode enviar');
        return;
      }

      socket.emit('sendMessage', { roomId, content, userId });
    },
    [socket, isConnected, roomId, userId],
  );

  return { isConnected, messages, sendMessage };
}
