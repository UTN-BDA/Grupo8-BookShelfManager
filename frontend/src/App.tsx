import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import BookshelfPage from './pages/BookshelfPage';
import Layout from './components/Layout';
import ColorPaletteDemo from './components/ColorPaletteDemo';
import { AuthProvider, useAuth } from './context/AuthContext';
import BookshelfDetailPage from './pages/BookshelfDetailPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-secondary">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/demo" element={<ColorPaletteDemo />} />
        
        {/* Rutas protegidas */}
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path="/bookshelfs" element={<BookshelfPage />} />
        <Route path="/bookshelf/:id" element={<BookshelfDetailPage />} />
        
        {/* Redirecciones */}
        <Route path="/libros" element={<Navigate to="/books" />} />
        <Route path="/libros/:id" element={<Navigate to="/books/:id" />} />
        <Route path="/" element={<Navigate to="/books" />} />
        <Route path="*" element={<Navigate to="/books" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
