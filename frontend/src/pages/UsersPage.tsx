import { useUsers } from '../hooks/useUsers';
import UserCard from '../components/UserCard';
import type { User } from '../services/userService';

export default function UsersPage() {
  const { users, loading, error, deleteUser, refresh } = useUsers();

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const success = await deleteUser(id);
      if (success) {
        alert('Usuario eliminado exitosamente');
      }
    }
  };

  const handleEdit = (user: User) => {
    alert(`Editar usuario: ${user.firstName} ${user.lastName}`);
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
        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
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
    </div>
  );
}
