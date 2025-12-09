import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import SuppliesModal from '../components/SuppliesModal';
import { suppliesService } from '../services/SuppliesService';
import type { SupplyCatalog, SupplyCategory } from '../types';

export default function SuppliesPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [supplies, setSupplies] = useState<SupplyCatalog[]>([]);
    const [categories, setCategories] = useState<SupplyCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSupply, setSelectedSupply] = useState<SupplyCatalog | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchSupplies();
    }, []);

    const fetchCategories = async () => {
        try {
            const categoriesData = await suppliesService.getSupplyCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories:', error);
            Swal.fire('Error', 'No se pudieron cargar las categorías', 'error');
        }
    };

    const fetchSupplies = async () => {
        setLoading(true);
        try {
            const allData = await suppliesService.getAll();
            
            if (Array.isArray(allData)) {
                setSupplies(allData);
            } else {
                console.error('Data is not an array:', allData);
                setSupplies([]);
            }
        } catch (error) {
            console.error('Error fetching supplies:', error);
            
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar suplementos',
                html: `
                    <p>No se pudieron cargar los suplementos.</p>
                    <p class="text-sm text-gray-600 mt-2">Detalles: ${errorMessage}</p>
                    <p class="text-sm text-gray-600 mt-2">Verifica que el backend esté funcionando correctamente.</p>
                `,
                confirmButtonColor: '#0891b2'
            });
            
            setSupplies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedSupply(null);
        setIsModalOpen(true);
    };

    const handleEdit = (supply: SupplyCatalog) => {
        setSelectedSupply(supply);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await suppliesService.deleteSupply(id);
                Swal.fire('Eliminado', 'El suplemento ha sido eliminado.', 'success');
                fetchSupplies();
            } catch (error) {
                console.error('Error deleting supply:', error);
                Swal.fire('Error', 'No se pudo eliminar el suplemento', 'error');
            }
        }
    };

    const handleSave = async (data: SupplyCatalog) => {
        try {
            if (selectedSupply && selectedSupply.idSupplies) {
                await suppliesService.updateSupply(selectedSupply.idSupplies, data);
                Swal.fire('Actualizado', 'Suplemento actualizado correctamente', 'success');
            } else {
                await suppliesService.createSupply(data);
                Swal.fire('Creado', 'Suplemento creado correctamente', 'success');
            }
            setIsModalOpen(false);
            fetchSupplies();
        } catch (error) {
            console.error('Error saving supply:', error);
            Swal.fire('Error', 'No se pudo guardar el suplemento', 'error');
            throw error;
        }
    };

    const getCategoryName = (categoryId: number): string => {
        const category = categories.find(c => c.idSupplies_Category === categoryId);
        return category ? category.Category_Name : 'N/A';
    };

    const filteredSupplies = supplies.filter(s => 
        s.Supplie_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Catálogo de Suplementos</h2>
                        <button 
                            onClick={handleCreate}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Nuevo Suplemento
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Search */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="space-y-2">
                            <label htmlFor="search" className="text-sm font-semibold text-gray-700 block">
                                Buscar por Nombre
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input 
                                    type="text"
                                    id="search"
                                    placeholder="Buscar suplemento..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Nombre</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Categoría</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                                Cargando suplementos...
                                            </td>
                                        </tr>
                                    ) : filteredSupplies.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                                No se encontraron suplementos
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredSupplies.map((supply) => (
                                            <tr key={supply.idSupplies} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                    {supply.Supplie_Name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {getCategoryName(supply.Supplies_Category_idSupplies_Category)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleEdit(supply)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(supply.idSupplies!)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                <SuppliesModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    initialData={selectedSupply}
                />
            </div>
        </div>
    );
}
