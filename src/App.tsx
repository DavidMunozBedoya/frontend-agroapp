import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NoveltiesPage from './pages/NoveltiesPage';
import ProductionPage from './pages/Production';
import ExpensesPage from "./pages/ExpensesPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/novelties" element={<NoveltiesPage />} />
      <Route path="/production" element={<ProductionPage />} />
      <Route path="/expenses" element={<ExpensesPage />} />
    </Routes>
  );
}

export default App;
