import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../../components/Modal/Modal';
import styles from './Register.module.css';

export function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !username || !password) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (res.ok) {
        navigate('/');
      } else {
        const data = await res.json();
        setError(data.message || 'Erro ao criar usuário');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar usuário');
    }
  };

  return (
    <Modal
      title="Criar Conta"
      onSubmit={handleRegister}
      buttonLabel="Criar Conta"
      buttonClassName={styles.button}
    >
      <input
        className={styles.input}
        placeholder="Nome de usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
      />

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.registerLink}>
        Já tem uma conta? <Link to="/">Entrar</Link>
      </p>
    </Modal>
  );
}
