import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LayoutDashboard, Bell, DollarSign } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/CardsDashboard';
import LotesTable from '../components/BatchTable';
import EspeciesTable from '../components/SpeciesTable';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Tarjetas superiores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card title="Lotes" value="0" icon={LayoutDashboard} />
            <div onClick={() => navigate('/novelties')} className="cursor-pointer transition-transform hover:scale-105">
                <Card title="Novedades" value="0" icon={Bell} />
            </div>
            <Card title="Gastos" value="$0" icon={DollarSign} />
          </div>

          {/* Tabla de Lotes */}
          <div className="mb-6">
            <LotesTable />
          </div>

          {/* Tabla de Especies */}
          <div>
            <EspeciesTable />
          </div>
        </main>
      </div>
    </div>
  )
}