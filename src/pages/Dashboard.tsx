import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, LayoutDashboard, Bell, DollarSign } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/CardsDashboard';
import LotesTable from '../components/BatchTable';
import EspeciesTable from '../components/SpeciesTable';

// ← AGREGAR ESTA INTERFAZ
interface Expense {
    idProduction_Expenses: number;
    Supplies_idSupplies: number;
    Description: string;
    Cost: string | number;
    Quantity: string | number;
    Batches_idBatches: number;
    Date_Expense: string;
}

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [stats, setStats] = useState({
        totalLotes: 0,
        totalNovedades: 0,
        totalGastos: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [batchesRes, noveltiesRes, expensesRes] = await Promise.all([
                fetch('http://localhost:3300/batch'),
                fetch('http://localhost:3300/novelties'),
                fetch('http://localhost:3300/production-expenses')
            ]);

            const batchesData = await batchesRes.json();
            const noveltiesData = await noveltiesRes.json();
            const expensesData = await expensesRes.json();

            const batches = Array.isArray(batchesData.data) ? batchesData.data : batchesData;
            const novelties = Array.isArray(noveltiesData.data) ? noveltiesData.data : noveltiesData;
            const expenses: Expense[] = Array.isArray(expensesData.data) ? expensesData.data : expensesData;

            // ← CAMBIAR AQUÍ
            const totalGastosValue = expenses.reduce((sum: number, expense: Expense) => {
                const cost = parseFloat(String(expense.Cost)) || 0;
                const quantity = parseFloat(String(expense.Quantity)) || 0;
                return sum + (cost * quantity);
            }, 0);

            setStats({
                totalLotes: batches.length,
                totalNovedades: novelties.length,
                totalGastos: totalGastosValue
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar 
                isOpen={sidebarOpen} 
                setIsOpen={setSidebarOpen} 
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <Card 
                            title="Lotes" 
                            value={loading ? 'Cargando...' : stats.totalLotes} 
                            icon={LayoutDashboard} 
                        />
                        <div 
                            onClick={() => navigate('/novelties')} 
                            className="cursor-pointer transition-transform hover:scale-105"
                        >
                            <Card 
                                title="Novedades" 
                                value={loading ? 'Cargando...' : stats.totalNovedades} 
                                icon={Bell} 
                            />
                        </div>
                        <Card 
                            title="Gastos" 
                            value={loading ? 'Cargando...' : formatCurrency(stats.totalGastos)} 
                            icon={DollarSign} 
                        />
                    </div>

                    <div className="mb-6">
                        <LotesTable />
                    </div>

                    <div>
                        <EspeciesTable />
                    </div>
                </main>
            </div>
        </div>
    );
}