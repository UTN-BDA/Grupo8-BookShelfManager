import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-secondary to-secondary-300 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="heading-1 text-primary-800">
            BookShelf Manager
          </h1>
          <p className="text-text-light">
            Tu biblioteca digital personal
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <div className="text-center mb-6">
            <h2 className="heading-2 text-primary">Iniciar Sesión</h2>
            <p className="text-text-light">
              Ingresa tus credenciales para acceder
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-accent-50 border-l-4 border-accent p-4 rounded-lg">
                <div className="flex items-center">
                  <span className="text-accent mr-2">⚠️</span>
                  <p className="text-accent-800 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-text">
                📧 Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                className="input"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-text">
                🔒 Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input"
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className={`btn-primary w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader size="sm" color="neutral" text="" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                '🚀 Iniciar Sesión'
              )}
            </button>
          </form>
          
          <div className="text-center mt-6 pt-6 border-t border-neutral-300">
            <p className="text-text-light">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="link font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-text-lighter">
            © 2025 BookShelf Manager - Desarrollado con ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
