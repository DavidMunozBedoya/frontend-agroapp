import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import NoveltiesPage from './pages/NoveltiesPage';
import ProductionPage from './pages/Production';
import LoginPage from './pages/LoginPage';
import ExpensesPage from './pages/ExpensesPage';
import SuppliesPage from './pages/SuppliesPage';

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Ruta de login */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Rutas protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/novelties" element={
        <ProtectedRoute>
          <NoveltiesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/production" element={
        <ProtectedRoute>
          <ProductionPage />
        </ProtectedRoute>
      } />

      <Route path='/expenses' element={
        <ProtectedRoute>
          <ExpensesPage />
        </ProtectedRoute>
      } />

      <Route path='/supplies' element={
        <ProtectedRoute>
          <SuppliesPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;