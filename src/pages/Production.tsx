import { useState, useEffect } from 'react';
import { Plus, Eye, Search, Menu, Calendar, TrendingUp } from 'lucide-react';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import ProductionModal from '../components/ProductionModal';
import { productionService } from '../services/ProdcutionService';
import { batchesService } from '../services/BatchesService';
import type { Production, Batch } from '../types';

export default function ProductionPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [productions, setProductions] = useState<Production[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productionsData, batchesData] = await Promise.all([
                productionService.getAll(),
                batchesService.getAll()
            ]);
            
            // Validar que sean arrays y mostrar en consola
            console.log('Productions data:', productionsData);
            console.log('Batches data:', batchesData);
            
            setProductions(Array.isArray(productionsData) ? productionsData : []);
            setBatches(Array.isArray(batchesData) ? batchesData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            Swal.fire('Error', 'No se pudieron cargar los datos', 'error');
            setProductions([]);
            setBatches([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setIsModalOpen(true);
    };

    const handleSave = async (data: {
        Batches_idBatches: number;  // ← CAMBIAR AQUÍ
        Avg_Weight: number;
        Weight_Cost: number;
    }) => {
        try {
            await productionService.create(data);
            Swal.fire('Éxito', 'Producción registrada correctamente', 'success');
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Error saving production:', error);
            Swal.fire('Error', 'No se pudo guardar la producción', 'error');
            throw error;
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getBatchInfo = (batchId: number) => {
    const batch = batches.find(b => b.idBatch === batchId);
    if (batch) {
        return `Lote #${batchId} - ${batch.Specie_Name || 'N/A'}`;
    }
    return `Lote #${batchId}`;
};

    
    const filteredProductions = productions.filter(p => {
    if (!searchTerm) return true;
    
    const batch = batches.find(b => b.idBatch === p.Batches_idBatches); // ← Cambiar aquí
    if (!batch || !batch.Specie_Name) return false;
    
    return batch.Specie_Name.toLowerCase().includes(searchTerm.toLowerCase());
});

    const totalRevenue = productions.reduce((sum, p) => sum + p.Total_Production, 0);
    const totalWeight = productions.reduce((sum, p) => sum + p.Total_Weight, 0);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden text-gray-500 hover:text-gray-700"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800">Producción</h2>
                        </div>
                        <button 
                            onClick={handleCreate}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Registrar Venta
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Ventas</p>
                                    <p className="text-2xl font-bold text-gray-900">{productions.length}</p>
                                </div>
                                <Calendar className="w-10 h-10 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Peso Total Vendido</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalWeight.toFixed(0)} kg</p>
                                </div>
                                <TrendingUp className="w-10 h-10 text-orange-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
                                </div>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl">💰</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Buscar por especie..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Lote</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Fecha</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Peso Promedio</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Peso Total</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Precio/kg</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total Venta</th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                                Cargando...
                                            </td>
                                        </tr>
                                    ) : filteredProductions.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                                No hay registros de producción
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProductions.map((production) => (
                                            <tr key={production.idProduction} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    #{production.idProduction}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {getBatchInfo(production.Batches_idBatches)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {formatDate(production.Date_Production)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <span className="font-medium">{production.Avg_Weight.toFixed(2)}</span> kg
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <span className="font-semibold text-blue-600">
                                                        {production.Total_Weight.toFixed(2)}
                                                    </span> kg
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    ${production.Weight_Cost.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className="font-bold text-green-600 text-base">
                                                        {formatCurrency(production.Total_Production)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium">
                                                    <button 
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                <ProductionModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    batches={batches}
                />
            </div>
        </div>
    );
}