import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../../components/Modal/Modal';
import styles from './Login.module.css';

const API_URL = import.meta.env.VITE_API_URL;

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Erro ao fazer login');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  return (
    <Modal title="Entrar no Chat" onSubmit={handleLogin} buttonLabel="Entrar" buttonClassName={styles.button}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        className={styles.input}
      />
      {error && <p className={styles.error}>{error}</p>}
      <p className={styles.registerLink}>
        Não tem uma conta? <Link to="/register">Crie uma aqui</Link>
      </p>
    </Modal>
  );
}
