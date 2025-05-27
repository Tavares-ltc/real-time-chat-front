import { useEffect, useRef, useState } from 'react';

type MessageHandler = (message: string) => void;

export function useWebSocket(url: string, onMessage?: MessageHandler) {
  const socket = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);
    socket.current = ws;

    ws.onopen = () => setIsConnected(true);

    ws.onmessage = (event) => {
      const msg = event.data;
      setMessages((prev) => [...prev, msg]);
      if (onMessage) onMessage(msg);
    };

    ws.onclose = () => setIsConnected(false);

    return () => {
      ws.close();
    };
  }, [url, onMessage]);

  const sendMessage = (msg: string) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(msg);
    }
  };

  return { isConnected, messages, sendMessage };
}
