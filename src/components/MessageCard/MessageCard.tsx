import styles from './MessageCard.module.css'
import { Avatar } from '../Avatar/Avatar'

interface MessageCardProps {
  author: string
  content: React.ReactNode
  time: string
}

export function MessageCard({ author, content, time }: MessageCardProps) {
  return (
    <div className={styles.card}>
      <Avatar name={author} />
      <div className={styles.content}>
        <div className={styles.author}>{author}</div>
        <div className={styles.message}>{content}</div>
        <div className={styles.time}>{time}</div>
      </div>
    </div>
  )
}
