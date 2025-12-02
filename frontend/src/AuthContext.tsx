import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import api from "./api";

type User = {
  id: number;
  email: string;
  full_name: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  setToken: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar token do localStorage na inicialização
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setTokenState(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Buscar dados do usuário quando token mudar
  const fetchUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/me");
      setUser(response.data);
    } catch {
      // Token inválido/expirado
      setTokenState(null);
      localStorage.removeItem("auth_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("auth_token", newToken);
    } else {
      localStorage.removeItem("auth_token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
