import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../api/authApi';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  const updateUser = (next) => {
    localStorage.setItem('user', JSON.stringify(next));
    setUser(next);
  };
  const save = ({ token, user }) => {
    localStorage.setItem('token', token);
    updateUser(user);
  };

  const login = async (data) => save(await loginUser(data));
  const register = async (data) => save(await registerUser(data));
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
  );
}
