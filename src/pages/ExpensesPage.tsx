// src/pages/ExpensesPage.tsx
import { useState } from "react";
import { Menu, DollarSign } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Card from "../components/CardsDashboard";
import ExpensesTable from "../components/ExpensesTable";

export default function ExpensesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Gastos</h2>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Card resumen arriba */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Gastos de Producción" value="" icon={DollarSign} />
          </div>

          {/* Tabla de gastos */}
          <ExpensesTable />
        </main>
      </div>
    </div>
  );
}
