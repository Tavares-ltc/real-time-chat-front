import type { ReactNode } from 'react';
import styles from './Modal.module.css';

export type ModalProps = {
  title: string;
  children: ReactNode;
  onSubmit: () => void | Promise<void>;
  buttonLabel: string;
  buttonClassName?: string;
};

export function Modal({ title, children, onSubmit, buttonLabel, buttonClassName }: ModalProps) {
  return (
    <div className={styles.modalContainer}>
      <h2 className={styles.modalTitle}>{title}</h2>
      <div className={styles.modalBody}>{children}</div>
      <button onClick={onSubmit} className={buttonClassName}>
        {buttonLabel}
      </button>
    </div>
  );
}
