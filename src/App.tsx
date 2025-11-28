import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NoveltiesPage from './pages/NoveltiesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/novelties" element={<NoveltiesPage />} />
    </Routes>
  );
}

export default App;
