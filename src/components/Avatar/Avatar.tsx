import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
  size?: 'small' | 'medium' | 'large'
}

export function Avatar({ name, size = 'medium' }: AvatarProps) {
  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      <span>{name[0].toUpperCase()}</span>
    </div>
  )
}
