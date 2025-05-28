import { useEffect, useState, useRef } from 'react'
import { api } from '../../services/api'
import styles from './MessagesPanel.module.css'
import { useAuth } from '../../contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { useMessageSocket } from '../../hooks/useMessageSocket'

interface Message {
  id: string
  content: string
  createdAt: string
  user: {
    username: string
    img?: string
  }
}

interface Room {
  id: string
  name: string
}

interface MessagesPanelProps {
  roomId: string
}

export function MessagesPanel({ roomId }: MessagesPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [room, setRoom] = useState<Room | null>(null)

  const { user } = useAuth()

  const { isConnected, messages: socketMessages, sendMessage } = useMessageSocket(roomId, user?.id ?? '')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages((prevMessages) => {
      const newMessages = socketMessages.filter(
        (msg) => !prevMessages.some((m) => m.id === msg.id)
      )
      return [...prevMessages, ...newMessages]
    })
  }, [socketMessages])

  useEffect(() => {
    async function fetchRoom() {
      try {
        const response = await api.get(`/rooms/${roomId}`)
        setRoom(response.data)
      } catch (error) {
        console.error('Erro ao buscar sala:', error)
      }
    }

    async function fetchMessages() {
      try {
        const response = await api.get(`/messages/room/${roomId}`)
        setMessages(response.data)
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error)
      }
    }

    fetchRoom()
    fetchMessages()
  }, [roomId])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return
    if (!isConnected) return

    sendMessage(newMessage)
    setNewMessage('')
  }

  return (
    <div className={styles.panelContainer}>
      <header className={styles.header}>
        <h2>{room ? `# ${room.name}` : 'Carregando...'}</h2>
      </header>

      <div className={styles.messagesList}>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.messageItem}>
            <img
              src={
                msg.user.img ||
                'https://i.pinimg.com/236x/21/9e/ae/219eaea67aafa864db091919ce3f5d82.jpg'
              }
              alt={msg.user.username}
            />
            <div>
              <strong>{msg.user.username}</strong>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  )
}
