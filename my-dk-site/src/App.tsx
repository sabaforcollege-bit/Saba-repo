// src/App.jsx-ის მაგალითი
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Photos } from './pages/Photos';
import { Games } from './pages/Games';

function App() {
  return (
    <Router>
      <nav className="bg-gray-900 text-white p-4 flex gap-6">
        <Link to="/" className="hover:text-blue-400">მთავარი</Link>
        <Link to="/photos" className="hover:text-blue-400">ფოტოები</Link>
        <Link to="/games" className="hover:text-blue-400">თამაშები</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photos" element={<Photos />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </Router>
  );
}

export default App;