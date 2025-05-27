import styles from './HomePage.module.css';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { useState } from 'react';

export function HomePage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  return (
    <div className={styles.homeContainer}>
      <Sidebar onRoomSelect={setSelectedRoomId} />

      <main className={styles.mainContent}>
        {selectedRoomId ? (
          <p>Sala selecionada: {selectedRoomId}</p>
        ) : (
          <p>Selecione uma sala para ver as mensagens.</p>
        )}
      </main>
    </div>
  );
}
