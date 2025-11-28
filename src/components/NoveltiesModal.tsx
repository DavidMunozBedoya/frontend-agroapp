import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';
import { noveltiesService } from '../services/noveltiesService';
import type { Category, Lote, Novelty } from '../types';

interface NoveltiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Novelty) => Promise<void>;
    initialData?: Novelty | null;
}

const NoveltiesModal = ({ isOpen, onClose, onSave, initialData }: NoveltiesModalProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [formData, setFormData] = useState<Novelty>({
        Quantity: 1,
        Description: '',
        Date_Novelty: new Date().toISOString().split('T')[0],
        Batches_idBatches: 0,
        Novelty_Categories_idNovelty_Categories: 0
    });
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchData();
            if (initialData) {
                setFormData({
                    ...initialData,
                    Date_Novelty: initialData.Date_Novelty.split('T')[0] // Format date for input
                });
            } else {
                // Reset form when opening in create mode
                setFormData({
                    Quantity: 1,
                    Description: '',
                    Date_Novelty: new Date().toISOString().split('T')[0],
                    Batches_idBatches: 0,
                    Novelty_Categories_idNovelty_Categories: 0
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchData = async () => {
        setLoadingData(true);
        try {
            const [categoriesData, lotesData] = await Promise.all([
                noveltiesService.getCategories(),
                noveltiesService.getLotes()
            ]);
            console.log('Setting categories:', categoriesData);
            console.log('Setting lotes:', lotesData);
            setCategories(categoriesData);
            setLotes(lotesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            // alert('Error cargando datos necesarios');
        } finally {
            setLoadingData(false);
        }
    };

    if (!isOpen) return null;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.Novelty_Categories_idNovelty_Categories || !formData.Batches_idBatches || !formData.Description.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor complete todos los campos obligatorios.',
                confirmButtonColor: '#0891b2'
            });
            return;
        }

        if (formData.Quantity <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Cantidad inválida',
                text: 'La cantidad debe ser mayor a 0.',
                confirmButtonColor: '#0891b2'
            });
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error al guardar la novedad:', error);
            // Error handling is likely done in onSave (Dashboard), but if it propagates:
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al guardar la novedad.',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay con blur */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-2xl mx-4 sm:mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                                {initialData ? 'Editar Novedad' : 'Nueva Novedad'}
                            </h3>
                            <button 
                                type="button" 
                                onClick={onClose}
                                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1.5 transition-all duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div>
                        <div className="px-6 py-6 space-y-4">
                            {loadingData ? (
                                <div className="text-center py-4 text-gray-500">Cargando datos...</div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Category Select */}
                                        <div className="space-y-2">
                                            <label 
                                                htmlFor="category" 
                                                className="text-sm font-semibold text-gray-700 block"
                                            >
                                                Categoría
                                            </label>
                                            <select
                                                id="category"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none"
                                                value={formData.Novelty_Categories_idNovelty_Categories}
                                                onChange={(e) => setFormData({ ...formData, Novelty_Categories_idNovelty_Categories: Number(e.target.value) })}
                                                required
                                            >
                                                <option value={0}>Seleccione una categoría</option>
                                                {categories.map(cat => (
                                                    <option key={cat.idNovelty_Categories} value={cat.idNovelty_Categories}>
                                                        {cat.Category_Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Lote Select */}
                                        <div className="space-y-2">
                                            <label 
                                                htmlFor="lote" 
                                                className="text-sm font-semibold text-gray-700 block"
                                            >
                                                Lote
                                            </label>
                                            <select
                                                id="lote"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none"
                                                value={formData.Batches_idBatches}
                                                onChange={(e) => setFormData({ ...formData, Batches_idBatches: Number(e.target.value) })}
                                                required
                                            >
                                                <option value={0}>Seleccione un lote</option>
                                                {lotes.map(lote => (
                                                    <option key={lote.idBatches} value={lote.idBatches}>
                                                        {lote.Batch_Name || `Lote ${lote.idBatches}`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Quantity */}
                                        <div className="space-y-2">
                                            <label 
                                                htmlFor="quantity" 
                                                className="text-sm font-semibold text-gray-700 block"
                                            >
                                                Cantidad
                                            </label>
                                            <input 
                                                type="number" 
                                                id="quantity" 
                                                min="1"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                                required 
                                                value={formData.Quantity}
                                                onChange={(e) => setFormData({ ...formData, Quantity: Number(e.target.value) })}
                                            />
                                        </div>

                                        {/* Date */}
                                        <div className="space-y-2">
                                            <label 
                                                htmlFor="date" 
                                                className="text-sm font-semibold text-gray-700 block"
                                            >
                                                Fecha
                                            </label>
                                            <input 
                                                type="date" 
                                                id="date" 
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                                required 
                                                value={formData.Date_Novelty}
                                                onChange={(e) => setFormData({ ...formData, Date_Novelty: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label 
                                            htmlFor="description" 
                                            className="text-sm font-semibold text-gray-700 block"
                                        >
                                            Descripción
                                        </label>
                                        <textarea 
                                            id="description" 
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none resize-none" 
                                            placeholder="Detalle de la novedad..." 
                                            required 
                                            value={formData.Description}
                                            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end border-t border-gray-200">
                            <button 
                                onClick={onClose}
                                className="w-full sm:w-auto px-6 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 font-medium rounded-xl transition-all duration-200 focus:ring-2 focus:ring-gray-200" 
                                type="button"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSubmit}
                                className="w-full sm:w-auto px-6 py-2.5 text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 font-medium rounded-xl transition-all duration-200 focus:ring-2 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/30" 
                                type="button"
                                disabled={loading || loadingData}
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NoveltiesModal;
