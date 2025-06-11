import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">BookShelf Manager</Link>
          
          <nav className="flex space-x-4 items-center">
            <Link to="/books" className="hover:text-blue-200 transition-colors">Libros</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/bookshelfs" className="hover:text-blue-200 transition-colors">Estanterías</Link>
                <Link to="/users" className="hover:text-blue-200 transition-colors">Usuarios</Link>
                <div className="relative group">
                  <button className="flex items-center hover:text-blue-200 transition-colors">
                    <span>{currentUser?.firstName ?? 'Usuario'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                    <div className="py-1">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Perfil</Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">Iniciar Sesión</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-1 rounded-md hover:bg-blue-50 transition-colors">Registrarse</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow pb-12">
        {children}
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 BookShelf Manager. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
