import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import Sidebar from '../components/Sidebar';
import NoveltiesModal from '../components/NoveltiesModal';
import { noveltiesService } from '../services/noveltiesService';
import type { Novelty } from '../types';

export default function NoveltiesPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [novelties, setNovelties] = useState<Novelty[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNovelty, setSelectedNovelty] = useState<Novelty | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchNovelties();
    }, []);

    const fetchNovelties = async () => {
        setLoading(true);
        try {
            const data = await noveltiesService.getAll();
            console.log('Novelties data:', data);
            if (Array.isArray(data)) {
                setNovelties(data);
            } else {
                console.error('Data is not an array:', data);
                setNovelties([]);
                Swal.fire('Error', 'Formato de datos incorrecto', 'error');
            }
        } catch (error) {
            console.error('Error fetching novelties:', error);
            Swal.fire('Error', 'No se pudieron cargar las novedades', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedNovelty(null);
        setIsModalOpen(true);
    };

    const handleEdit = (novelty: Novelty) => {
        setSelectedNovelty(novelty);
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
                await noveltiesService.delete(id);
                Swal.fire('Eliminado', 'La novedad ha sido eliminada.', 'success');
                fetchNovelties();
            } catch (error) {
                console.error('Error deleting novelty:', error);
                Swal.fire('Error', 'No se pudo eliminar la novedad', 'error');
            }
        }
    };

    const handleSave = async (data: Novelty) => {
        try {
            if (selectedNovelty && selectedNovelty.idNovelties) {
                await noveltiesService.update(selectedNovelty.idNovelties, data);
                Swal.fire('Actualizado', 'Novedad actualizada correctamente', 'success');
            } else {
                await noveltiesService.create(data);
                Swal.fire('Creado', 'Novedad creada correctamente', 'success');
            }
            setIsModalOpen(false);
            fetchNovelties();
        } catch (error) {
            console.error('Error saving novelty:', error);
            Swal.fire('Error', 'No se pudo guardar la novedad', 'error');
            throw error; // Propagate to modal to stop loading state
        }
    };

    const filteredNovelties = novelties.filter(n => 
        n.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">Novedades</h2>
                        <button 
                            onClick={handleCreate}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Nueva Novedad
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Buscar por descripción..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Fecha</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Descripción</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Cantidad</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                Cargando novedades...
                                            </td>
                                        </tr>
                                    ) : filteredNovelties.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                No se encontraron novedades
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredNovelties.map((novelty) => (
                                            <tr key={novelty.idNovelties} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(novelty.Date_Novelty).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                    {novelty.Description}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {novelty.Quantity}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleEdit(novelty)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(novelty.idNovelties!)}
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

                <NoveltiesModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    initialData={selectedNovelty}
                />
            </div>
        </div>
    );
}
