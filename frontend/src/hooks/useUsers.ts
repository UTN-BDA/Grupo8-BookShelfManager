import { useEffect, useState } from 'react';
import {type User, userService } from '../services/userService';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el usuario');
      return false;
    }
  };

  return { 
    users, 
    loading, 
    error,
    refresh: fetchUsers,
    deleteUser
  };
}
