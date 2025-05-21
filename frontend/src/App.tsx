import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/libros" element={<BooksPage />} />
        <Route path="/libros/:id" element={<BookDetailPage />} />
        <Route path="/" element={<div></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
