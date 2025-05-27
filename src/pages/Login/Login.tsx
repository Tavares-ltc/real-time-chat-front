import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../../components/Modal/Modal';
import styles from './Login.module.css';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
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
