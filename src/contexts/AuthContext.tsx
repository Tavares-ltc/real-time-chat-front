import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface User {
  img: string;
  name: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/profile')
        .then((response) => setUser(response.data))
        .catch(() => logout());
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    //const profile = await api.get('/auth/profile');
    const profile = {data: {name: "test", img: "https://i.pinimg.com/236x/21/9e/ae/219eaea67aafa864db091919ce3f5d82.jpg"}}
    setUser(profile.data);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {
  return useContext(AuthContext);
}