import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  getStoredUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserProfile,
} from "../services/authService";
import * as SecureStore from "expo-secure-store";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (
    email: string,
    username: string,
    password?: string
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load stored user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const storedUser = await getStoredUser();

        if (token && storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        console.log("SecureStore Error:", err);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const loggedInUser = await loginUser(email, password);
    setUser(loggedInUser);
  };

  const register = async (email: string, password: string, username: string) => {
    const newUser = await registerUser(email, password, username);
    setUser(newUser);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const updateProfile = async (
    email: string,
    username: string,
    password?: string
  ) => {
    const updatedUser = await updateUserProfile(email, username, password);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
