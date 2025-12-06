import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NoveltiesPage from './pages/NoveltiesPage';
import ProductionPage from './pages/Production';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/novelties" element={<NoveltiesPage />} />
      <Route path="/production" element={<ProductionPage />} />
    </Routes>
  );
}

export default App;
