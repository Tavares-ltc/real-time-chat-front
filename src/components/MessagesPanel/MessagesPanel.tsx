import { useEffect, useState, useRef } from 'react'
import { api } from '../../services/api'
import styles from './MessagesPanel.module.css'
import { useAuth } from '../../contexts/AuthContext'
import { useMessageSocket } from '../../hooks/useMessageSocket'
import { formatDateToDDMMYYHHMM } from '../../helpers/date.helper'
import { MessageCard } from '../MessageCard/MessageCard'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'

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
    if (!newMessage.trim() || !user || !isConnected) return
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
          <MessageCard
            key={msg.id}
            author={msg.user.username}
            content={
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            }
            time={formatDateToDDMMYYHHMM(msg.createdAt)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <textarea
          placeholder="Digite uma mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  )
}
