import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { Species } from '../types';
import { speciesService } from '../services/speciesService';
import SpeciesModal from './SpeciesModal';
import { showAlert, showConfirm } from '../utils/alertUtils';

const SpeciesTable = () => {
    const [species, setSpecies] = useState<Species[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSpecies, setCurrentSpecies] = useState<Species | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSpecies = async () => {
        try {
            const data = await speciesService.getAll();
            setSpecies(data);
        } catch (error) {
            console.error('Error fetching species:', error);
            showAlert('Error', 'No se pudieron cargar las especies', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecies();
    }, []);

    const handleAdd = () => {
        setCurrentSpecies(null);
        setIsModalOpen(true);
    };

    const handleEdit = (specie: Species) => {
        setCurrentSpecies(specie);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const confirmed = await showConfirm('¿Estás seguro?', 'Esta acción no se puede deshacer');
        if (confirmed) {
            try {
                await speciesService.delete(id);
                showAlert('Eliminado', 'La especie ha sido eliminada correctamente');
                fetchSpecies();
            } catch (error) {
                console.error('Error deleting species:', error);
                showAlert('Error', 'No se pudo eliminar la especie', 'error');
            }
        }
    };

    const handleSave = async (data: Omit<Species, 'idSpecies'>) => {
        try {
            if (currentSpecies) {
                await speciesService.update(currentSpecies.idSpecies, data);
                showAlert('Actualizado', 'La especie ha sido actualizada correctamente');
            } else {
                await speciesService.create(data);
                showAlert('Creado', 'La especie ha sido creada correctamente');
            }
            fetchSpecies();
        } catch (error) {
            console.error('Error saving species:', error);
            showAlert('Error', 'No se pudo guardar la especie', 'error');
            throw error;
        }
    };

    return ( 
        <>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Gestión de Especies</h2>
                        <button 
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre de especie</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-gray-500">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : species.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-gray-500">
                                        No hay datos disponibles
                                    </td>
                                </tr>
                            ) : (
                                species.map((specie) => (
                                    <tr key={specie.idSpecies} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {specie.Specie_Name}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(specie)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(specie.idSpecies)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

            <SpeciesModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={currentSpecies}
            />
        </>
     );
}
 
export default SpeciesTable;