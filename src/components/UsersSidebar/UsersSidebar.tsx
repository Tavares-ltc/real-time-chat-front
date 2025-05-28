import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import styles from './UsersSidebar.module.css'
import { Avatar } from '../Avatar/Avatar'

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
  const [users, setUsers] = useState<UserRoom[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
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

  return (
    <aside className={styles.sidebar}>
      <h3>Usuários na sala</h3>

      <ul className={styles.usersList}>
        {users.length === 0 && <p>Nenhum usuário na sala ainda.</p>}
        {users.map((doc) => (
          <li key={doc.user.id} className={styles.userItem}>
            {doc.user.img ? <img
              src={doc.user.img}
              alt={doc.user.username}
              className={styles.userImg}
            /> : <Avatar name={doc.user.username} size='small'/>}
            
            <span>{doc.user.username}</span>
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
  )
}
