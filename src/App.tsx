import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NoveltiesPage from './pages/NoveltiesPage';
import SuppliesPage from './pages/SuppliesPage';
import ProductionPage from './pages/Production';
import ExpensesPage from './pages/ExpensesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/novelties" element={<NoveltiesPage />} />
      <Route path="/supplies" element={<SuppliesPage />} />
      <Route path="/production" element={<ProductionPage />} />
      <Route path="/expenses" element={<ExpensesPage />} />
    </Routes>
  );
}

export default App;