import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Sidebar.module.css';

interface Room {
  id: string;
  name: string;
  imageUrl?: string;
}

interface SidebarProps {
  onRoomSelect: (roomId: string) => void;
}

export function Sidebar({ onRoomSelect }: SidebarProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const defaultImageUrl = 'https://cdn-icons-png.flaticon.com/512/8377/8377384.png';

  const { user } = useAuth();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await api.get('/rooms');
        const roomsWithImages = response.data.map((room: Room) => ({
          ...room,
          imageUrl: room.imageUrl || defaultImageUrl,
        }));
        setRooms(roomsWithImages);
      } catch (error) {
        console.error('Erro ao buscar salas:', error);
      }
    }

    fetchRooms();
  }, []);

  async function handleCreateRoom() {
    if (!newRoomName.trim()) return;

    try {
      const response = await api.post('/rooms', { name: newRoomName });
      const newRoom: Room = {
        ...response.data,
        imageUrl: response.data.imageUrl || defaultImageUrl,
      };
      setRooms((prev) => [...prev, newRoom]);
      setNewRoomName('');
    } catch (error) {
      console.error('Erro ao criar sala:', error);
    }
  }

  return (
    <div className={styles.sidebarContainer}>
      <h1 className={styles.title}>Concordo</h1>

      <div className={styles.newRoom}>
        <input
          type="text"
          placeholder="Nova sala"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Criar</button>
      </div>

      <section className={styles.roomList}>
        {rooms.map((room) => (
          <div
            key={room.id}
            className={styles.roomItem}
            onClick={() => onRoomSelect(room.id)}
          >
            <img src={room.imageUrl || defaultImageUrl} alt={room.name} />
            <span style={{ color: 'white' }}>{room.name}</span>
          </div>
        ))}
      </section>

      <footer className={styles.footer}>
        {user && (
          <div className={styles.userInfo}>
            <img src={user.img} alt={user.username} />
            <span style={{ color: 'white' }}>{user.username}</span>
          </div>
        )}
      </footer>
    </div>
  );
}
