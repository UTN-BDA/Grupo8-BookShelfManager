import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

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
    
    // Validaciones básicas
    if (!formData.email || !formData.username || !formData.password || 
        !formData.confirmPassword || !formData.firstName || !formData.lastName) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Omitimos confirmPassword al enviar los datos
      const { confirmPassword, ...userData } = formData;
      await register(userData);
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      
      // Limpiar el formulario
      setFormData({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
      });
      
      // Redirigir al login después de un breve retraso
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error de registro:', err.response?.data);
      
      // Manejo más detallado de errores según el tipo
      if (err.response?.status === 409) {
        // Error de conflicto (email o username duplicado)
        const field = err.response.data.field;
        if (field === 'email') {
          setError('Este email ya está registrado. Por favor usa otro email o recupera tu contraseña.');
        } else if (field === 'username') {
          setError('Este nombre de usuario ya está en uso. Por favor elige otro.');
        } else {
          setError(`El campo ${field} ya está en uso.`);
        }
      } else if (err.response?.status === 400) {
        // Error de validación
        setError(err.response.data.message || 'Datos inválidos. Revisa los campos e inténtalo de nuevo.');
      } else {
        // Otros errores
        setError(err.response?.data?.message || 'Error al registrar. Por favor, intente nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
          <p className="mt-2 text-sm text-gray-600">Ingrese sus datos para registrarse</p>
        </div>
        
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}
          {success && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">{success}</div>}
          
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
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
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(isLoading || !!success) ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading || !!success}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            ¿Ya tienes una cuenta? Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
