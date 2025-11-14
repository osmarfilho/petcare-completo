import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { apiPublic } from "../lib/api"; 

interface AuthContextType {
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]); 

  const login = async (username: string, password: string) => {
    try {
      const response = await apiPublic.post<AuthTokens>("/api/token/", {
        username,
        password,
      });

      setAccessToken(response.data.access);

      console.log("✅ Login bem-sucedido. Token obtido:", response.data.access);
    } catch (error: any) {
      console.error("❌ Erro no login:", error.response?.data || error.message);
      throw new Error("Usuário ou senha inválidos");
    }
  };

  const logout = () => {
    setAccessToken(null); 
    console.log("🔒 Logout realizado com sucesso.");
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};