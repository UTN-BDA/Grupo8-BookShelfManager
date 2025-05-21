import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BooksPage from './pages/BooksPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/libros" element={<BooksPage />} />
        <Route path="/" element={<div></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
