import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import styles from './UsersSidebar.module.css'
import { Avatar } from '../Avatar/Avatar'
import { FiUsers } from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'

interface UserRoom {
  id: string
  joinedAt: Date
  user: {
    id: string
    username: string
    email: string
    img: string
    createdAt: Date
  }
  img?: string
}

interface UsersSidebarProps {
  roomId: string
}
export function UsersSidebar({ roomId }: UsersSidebarProps) {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserRoom[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchUsers()
    const interval = setInterval(fetchUsers, 10000)
    return () => clearInterval(interval)
  }, [roomId])

  async function fetchUsers() {
    try {
      const response = await api.get(`/room-users/${roomId}`)
      setUsers(Array.isArray(response.data) ? response.data : [])
    } catch {
      setUsers([])
    }
  }

  async function handleAddUser() {
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      await api.post(`/room-users`, { email, roomId })
      setEmail('')
      await fetchUsers()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao adicionar usuário')
    } finally {
      setLoading(false)
    }
  }

  async function handleLeaveRoom(userId: string) {
    if (!confirm('Tem certeza que deseja sair da sala?')) return
    try {
      await api.delete(`/room-users/${roomId}/${userId}`)
      await fetchUsers()
    } catch (err) {
      setError('Erro ao sair da sala')
    }
  }

  return (
    <>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir lista de usuários"
      >
        <FiUsers size={24} />
      </button>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <h3>Usuários na sala</h3>
        <ul className={styles.usersList}>
          {users.length === 0 && <p>Nenhum usuário na sala ainda.</p>}
          {users.map((doc) => (
            <li key={doc.user.id} className={styles.userItem}>
              {doc.user.img ? (
                <img
                  src={doc.user.img}
                  alt={doc.user.username}
                  className={styles.userImg}
                />
              ) : (
                <Avatar name={doc.user.username} size="small" />
              )}
              <span>{doc.user.username}</span>
              {user?.id === doc.user.id && (
                <button
                  className={styles.leaveButton}
                  onClick={() => handleLeaveRoom(user.id)}
                  title="Sair da sala"
                >
                  Sair
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className={styles.addUserContainer}>
          <input
            type="email"
            placeholder="Adicionar usuário por email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddUser()
            }}
            aria-label="Email do usuário para adicionar"
          />
          <button
            onClick={handleAddUser}
            disabled={loading || !email.trim()}
            aria-label="Adicionar usuário"
          >
            {loading ? 'Adicionando...' : 'Adicionar'}
          </button>
        </div>
        {error && <p className={styles.errorMsg}>{error}</p>}
      </aside>
    </>
  )
}
