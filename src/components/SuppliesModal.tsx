import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';
import { suppliesService } from '../services/SuppliesService';
import type { SupplyCategory, SupplyCatalog } from '../types';

interface SuppliesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: SupplyCatalog) => Promise<void>;
    initialData?: SupplyCatalog | null;
}

const SuppliesModal = ({ isOpen, onClose, onSave, initialData }: SuppliesModalProps) => {
    const [categories, setCategories] = useState<SupplyCategory[]>([]);
    const [formData, setFormData] = useState<SupplyCatalog>({
        Supplie_Name: '',
        Supplies_Category_idSupplies_Category: 0
    });
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            if (initialData) {
                setFormData({
                    ...initialData
                });
            } else {
                // Reset form when opening in create mode
                setFormData({
                    Supplie_Name: '',
                    Supplies_Category_idSupplies_Category: 0
                });
            }
        }
    }, [isOpen, initialData]);

    const fetchCategories = async () => {
        setLoadingData(true);
        try {
            const categoriesData = await suppliesService.getSupplyCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoadingData(false);
        }
    };

    if (!isOpen) return null;

    // Sanitize input to prevent SQL injection
    const sanitizeInput = (input: string): string => {
        return input
            .replace(/[<>]/g, '') // Remove HTML tags
            .replace(/['\";]/g, '') // Remove quotes and semicolons
            .trim();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate category
        if (!formData.Supplies_Category_idSupplies_Category || formData.Supplies_Category_idSupplies_Category === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Categoría requerida',
                text: 'Por favor seleccione una categoría.',
                confirmButtonColor: '#0891b2'
            });
            return;
        }

        // Validate and sanitize name
        const sanitizedName = sanitizeInput(formData.Supplie_Name);
        if (!sanitizedName || sanitizedName.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Nombre requerido',
                text: 'Por favor ingrese el nombre del suplemento.',
                confirmButtonColor: '#0891b2'
            });
            return;
        }

        if (sanitizedName.length > 100) {
            Swal.fire({
                icon: 'warning',
                title: 'Nombre muy largo',
                text: 'El nombre no puede exceder 100 caracteres.',
                confirmButtonColor: '#0891b2'
            });
            return;
        }

        setLoading(true);
        try {
            // Create sanitized data object
            const sanitizedData = {
                Supplie_Name: sanitizedName,
                Supplies_Category_idSupplies_Category: formData.Supplies_Category_idSupplies_Category
            };
            
            await onSave(sanitizedData);
            onClose();
        } catch (error) {
            console.error('Error al guardar el suplemento:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al guardar el suplemento.',
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
                                {initialData ? 'Editar Suplemento' : 'Nuevo Suplemento'}
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
                                    {/* Supply Name */}
                                    <div className="space-y-2">
                                        <label 
                                            htmlFor="supplyName" 
                                            className="text-sm font-semibold text-gray-700 block"
                                        >
                                            Nombre del Suplemento
                                        </label>
                                        <input 
                                            type="text" 
                                            id="supplyName" 
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                            placeholder="Ej: Vitamina B12." 
                                            required 
                                            value={formData.Supplie_Name}
                                            onChange={(e) => setFormData({ ...formData, Supplie_Name: e.target.value })}
                                            maxLength={100}
                                        />
                                    </div>

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
                                            value={formData.Supplies_Category_idSupplies_Category}
                                            onChange={(e) => setFormData({ ...formData, Supplies_Category_idSupplies_Category: Number(e.target.value) })}
                                            required
                                        >
                                            <option value={0}>Seleccione una categoría</option>
                                            {categories.map(cat => (
                                                <option key={cat.idSupplies_Category} value={cat.idSupplies_Category}>
                                                    {cat.Category_Name}
                                                </option>
                                            ))}
                                        </select>
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

export default SuppliesModal;
