import type { User } from '../services/userService';
import { useAuth } from '../context/AuthContext';

interface UserCardProps {
  user: User;
  onDelete?: (id: string) => void;
  onEdit?: (user: User) => void;
}

export default function UserCard({ user, onDelete, onEdit }: Readonly<UserCardProps>) {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h3>
          <p className="text-gray-600 text-sm">@{user.username}</p>
          <p className="text-gray-600 mt-1">{user.email}</p>
          <p className="text-blue-600 text-sm mt-1 font-medium">
            Rol: {user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Creado: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex space-x-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(user)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
                Editar
              </button>
            )}
            
            {onDelete && (
              <button 
                onClick={() => onDelete(user.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
