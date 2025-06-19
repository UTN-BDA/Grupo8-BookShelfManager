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
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="bg-primary text-white shadow-medium">
        <div className="container-main py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-secondary-200 transition-colors">
            📚 BookShelf Manager
          </Link>
          
          <nav className="flex space-x-6 items-center">
            <Link to="/books" className="link text-white hover:text-secondary-200">Libros</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/bookshelfs" className="link text-white hover:text-secondary-200">Estanterías</Link>
                <Link to="/users" className="link text-white hover:text-secondary-200">Usuarios</Link>
                <div className="relative group">
                  <button className="flex items-center text-white hover:text-secondary-200 transition-colors font-medium">
                    <span>👤 {currentUser?.firstName ?? 'Usuario'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-medium overflow-hidden z-10 hidden group-hover:block border border-neutral-300">
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-3 text-sm text-text hover:bg-neutral-200 transition-colors font-medium">
                        Mi Perfil
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-text hover:bg-neutral-200 transition-colors font-medium"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="link text-white hover:text-secondary-200">Iniciar Sesión</Link>
                <Link to="/register" className="btn-secondary text-primary font-semibold">Registrarse</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow pb-12 min-h-0">
        {children}
      </main>
      
      <footer className="bg-neutral-200 py-8 border-t border-neutral-300">
        <div className="container-main text-center">
          <p className="text-text-light text-sm">
            &copy; 2025 BookShelf Manager. Todos los derechos reservados.
          </p>
          <p className="text-text-lighter text-xs mt-2">
            Desarrollado con ❤️ para los amantes de los libros
          </p>
        </div>
      </footer>
    </div>
  );
}
