import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import type { Batch, Species, State } from '../types';
import { batchesService } from '../services/BatchesService';
import BatchModal from './BatchesModal';
import { showAlert, showConfirm } from '../utils/alertUtils';

const BatchTable = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [species, setSpecies] = useState<Species[]>([]);
    const [states, setStates] = useState<State[]>([
        { idStates: 1, State_Name: 'Activo' },
        { idStates: 2, State_Name: 'Inactivo' }
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchBatches = async () => {
        try {
            const data = await batchesService.getAll();
            setBatches(data);
        } catch (error) {
            console.error('Error fetching batches:', error);
            showAlert('Error', 'No se pudieron cargar los lotes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchSpecies = async () => {
        try {
            // Asume que tienes un servicio para especies
            const response = await fetch('http://localhost:3300/species');
            const data = await response.json();
            setSpecies(data);
        } catch (error) {
            console.error('Error fetching species:', error);
        }
    };


    useEffect(() => {
        fetchBatches();
        fetchSpecies();
    }, []);

    const handleAdd = () => {
        setCurrentBatch(null);
        setIsModalOpen(true);
    };

    const handleEdit = (batch: Batch) => {
        setCurrentBatch(batch);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const confirmed = await showConfirm('¿Estás seguro?', 'Esta acción no se puede deshacer');
        if (confirmed) {
            try {
                await batchesService.delete(id);
                showAlert('Eliminado', 'El lote ha sido eliminado correctamente');
                fetchBatches();
            } catch (error) {
                console.error('Error deleting batch:', error);
                showAlert('Error', 'No se pudo eliminar el lote', 'error');
            }
        }
    };

    const handleSave = async (data: Omit<Batch, 'idBatch' | 'Starting_Date'>) => {
        try {
            if (currentBatch) {
                await batchesService.update(currentBatch.idBatch, data);
                showAlert('Actualizado', 'El lote ha sido actualizado correctamente');
            } else {
                await batchesService.create(data);
                showAlert('Creado', 'El lote ha sido creado correctamente');
            }
            fetchBatches();
        } catch (error) {
            console.error('Error saving batch:', error);
            showAlert('Error', 'No se pudo guardar el lote', 'error');
            throw error;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    };

    const getSpecieName = (specieId: number) => {
        const specie = species.find(s => s.idSpecies === specieId);
        return specie ? specie.Specie_Name : 'N/A';
    };

    const getStateName = (stateId: number) => {
        const state = states.find(s => s.idStates === stateId);
        return state ? state.State_Name : 'N/A';
    };

    return ( 
        <>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Gestión de Lotes</h2>
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha de inicio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Costo unitario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Cantidad total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Costo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Peso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Edad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Especie</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                        Cargando...
                                    </td>
                                </tr>
                            ) : batches.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                                        No hay datos disponibles
                                    </td>
                                </tr>
                            ) : (
                                batches.map((batch) => (
                                    <tr key={batch.idBatch} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {formatDate(batch.Starting_Date)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {'$' + (isNaN(Number(batch.Unit_Cost)) ? '0.00' : Number(batch.Unit_Cost).toFixed(2))}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {batch.Total_Quantity}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {'$' + (isNaN(Number(batch.Cost)) ? '0.00' : Number(batch.Cost).toFixed(2))}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {batch.Weight_Batch} kg
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {batch.Age_Batch} días
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {getSpecieName(batch.Species_idSpecies)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {getStateName(batch.States_idStates)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleEdit(batch)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(batch.idBatch)}
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

            <BatchModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={currentBatch}
                species={species}
                states={states}
            />
        </>
    );
}
 
export default BatchTable;