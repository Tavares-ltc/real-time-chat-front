import { useState } from 'react'
import styles from './HomePage.module.css'
import { Sidebar } from '../../components/Sidebar/Sidebar'
import { MessagesPanel } from '../../components/MessagesPanel/MessagesPanel'
import { UsersSidebar } from '../../components/UsersSidebar/UsersSidebar'

export function HomePage() {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)

  return (
    <div className={styles.homeContainer}>
      <Sidebar onRoomSelect={setSelectedRoomId} />
      {selectedRoomId ? (
        <>
          <MessagesPanel roomId={selectedRoomId} />
          <UsersSidebar roomId={selectedRoomId} />
        </>
      ) : (
        <div className={styles.emptyPanel}>Selecione uma sala</div>
      )}
    </div>
  )
}
