import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService, type UpdateUserRequest } from '../services/userService';

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: currentUser?.email || '',
    username: currentUser?.username || '',
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!currentUser) {
      setError('Usuario no autenticado');
      return;
    }

    // Validación de contraseñas si se está cambiando
    if (formData.password) {
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      // Solo enviamos los campos que no estén vacíos para la contraseña
      const updateData: UpdateUserRequest = {
        email: formData.email,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      await userService.updateUser(currentUser.id, updateData);
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
      
      // Limpiar las contraseñas
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-600 rounded-md mx-auto max-w-4xl mt-8">
        <p>Debes iniciar sesión para ver tu perfil</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
        
        {error && <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}
        {success && <div className="p-3 mb-4 text-sm text-green-600 bg-green-50 rounded-md">{success}</div>}
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="usuario123"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Pérez"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nueva Contraseña <span className="text-xs text-gray-500">(dejar en blanco para mantener la actual)</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={!formData.password}
                  className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!formData.password ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                type="submit"
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Nombre de usuario</p>
                <p className="font-medium">{currentUser.username}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">{currentUser.firstName}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Apellido</p>
                <p className="font-medium">{currentUser.lastName}</p>
              </div>
              
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Miembro desde</p>
                <p className="font-medium">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Editar Perfil
              </button>
              
              <button 
                onClick={logout}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
