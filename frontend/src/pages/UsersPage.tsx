import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';
import type { User } from '../services/userService';
import EditUserModal from '../components/EditUserModal';
import { useState } from 'react';
import { userService } from '../services/userService';

export default function UsersPage() {
  const { currentUser } = useAuth();
  const { users, loading, error, deleteUser, refresh } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Only admin allows access to this page
  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="p-6 bg-red-50 text-red-700 rounded-md text-center">
          <h2 className="text-xl font-bold mb-2">Acceso Restringido</h2>
          <p>Solo los administradores pueden acceder a la gestión de usuarios.</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const success = await deleteUser(id);
      if (success) {
        alert('Usuario eliminado exitosamente');
      }
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleModalSave = async (updatedFields: Partial<User>) => {
    if (!editingUser) return;
    try {
      await userService.updateUser(editingUser.id, updatedFields);
      refresh();
      setModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      alert('Error al actualizar el usuario');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md mx-auto max-w-4xl mt-8">
        <p>{error}</p>
        <button 
          onClick={refresh}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refrescar
        </button>
      </div>

      <div className="mb-8">
        {users.length > 0 ? (
          users.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No hay usuarios para mostrar</p>
        )}
      </div>
      <EditUserModal
        user={editingUser as User}
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
    </div>
  );
}
