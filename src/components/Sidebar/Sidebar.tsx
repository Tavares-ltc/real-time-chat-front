import { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Sidebar.module.css'
import { FiPlus, FiHash, FiUser, FiMenu } from 'react-icons/fi'

interface Room {
  id: string
  name: string
  imageUrl?: string
}

interface SidebarProps {
  onRoomSelect: (roomId: string) => void
}

export function Sidebar({ onRoomSelect }: SidebarProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState('')
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const defaultImageUrl = 'https://cdn-icons-png.flaticon.com/512/8377/8377384.png'
  const { user } = useAuth()

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await api.get('/rooms')
        const roomsWithImages = response.data.map((room: Room) => ({
          ...room,
          imageUrl: room.imageUrl || defaultImageUrl,
        }))
        setRooms(roomsWithImages)
      } catch (error) {
        console.error('Erro ao buscar salas:', error)
      }
    }

    fetchRooms()

    const interval = setInterval(() => {
      fetchRooms()
    }, 10000)

    return () => clearInterval(interval)
  }, [])


  async function handleCreateRoom() {
    if (!newRoomName.trim()) return

    try {
      const response = await api.post('/rooms', { name: newRoomName })
      const newRoom: Room = {
        ...response.data,
        imageUrl: response.data.imageUrl || defaultImageUrl,
      }
      setRooms((prev) => [...prev, newRoom])
      setNewRoomName('')
    } catch (error) {
      console.error('Erro ao criar sala:', error)
    }
  }

  function handleRoomClick(roomId: string) {
    setSelectedRoomId(roomId)
    onRoomSelect(roomId)
    setIsMobileSidebarOpen(false)
  }

  function toggleMobileSidebar() {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <>
      <button className={styles.toggleButton} onClick={toggleMobileSidebar}>
        <FiMenu size={24} />
      </button>

      <div className={`${styles.sidebarOverlay} ${isMobileSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContainer}>
          <h1 className={styles.title}>Concordo</h1>

          <div className={styles.newRoom}>
            <input
              type="text"
              placeholder="Nova sala"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button onClick={handleCreateRoom} title="Criar nova sala">
              <FiPlus size={16} />
            </button>
          </div>

          <section className={styles.roomList}>
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`${styles.roomItem} ${selectedRoomId === room.id ? styles.selected : ''}`}
                onClick={() => handleRoomClick(room.id)}
              >
                <FiHash size={20} color="white" />
                <span style={{ color: 'white' }}>{room.name}</span>
              </div>
            ))}
          </section>

          <footer className={styles.footer}>
            {user && (
              <div className={styles.userInfo}>
                {user.img ? (
                  <img src={user.img} alt={user.username} />
                ) : (
                  <FiUser size={24} color="white" />
                )}
                <span style={{ color: 'white' }}>{user.username}</span>
              </div>
            )}
          </footer>
        </div>
      </div>

      <div className={styles.sidebarDesktop}>
        <div className={styles.sidebarContainer}>
          <h1 className={styles.title}>Concordo</h1>

          <div className={styles.newRoom}>
            <input
              type="text"
              placeholder="Nova sala"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button onClick={handleCreateRoom} title="Criar nova sala">
              <FiPlus size={16} />
            </button>
          </div>

          <section className={styles.roomList}>
            {rooms.map((room) => (
              <div
                key={room.id}
                className={`${styles.roomItem} ${selectedRoomId === room.id ? styles.selected : ''}`}
                onClick={() => handleRoomClick(room.id)}
              >
                <FiHash size={20} color="white" />
                <span style={{ color: 'white' }}>{room.name}</span>
              </div>
            ))}
          </section>

          <footer className={styles.footer}>
            {user && (
              <div className={styles.userInfo}>
                {user.img ? (
                  <img src={user.img} alt={user.username} />
                ) : (
                  <FiUser size={24} color="white" />
                )}
                <span style={{ color: 'white' }}>{user.username}</span>
              </div>
            )}
          </footer>
        </div>
      </div>
    </>
  )
}
