import { useState, useEffect } from 'react';
import type { Species } from '../types';
import { showAlert } from '../utils/alertUtils';

interface SpeciesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Species, 'idSpecies'>) => Promise<void>;
    initialData?: Species | null;
}

const SpeciesModal = ({ isOpen, onClose, onSave, initialData }: SpeciesModalProps) => {
    const [formData, setFormData] = useState({
        Specie_Name: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({ Specie_Name: initialData.Specie_Name });
        } else {
            setFormData({ Specie_Name: '' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const validateInput = (text: string) => {
        const regex = /^[a-zA-Z0-9\s\u00C0-\u00FF]+$/;
        return regex.test(text);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateInput(formData.Specie_Name)) {
            showAlert('Entrada inválida','Revise su registro');
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error al guardar la especie:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="relative w-full max-w-2xl mx-auto my-auto">
                <div className="relative bg-white rounded-xl shadow-2xl transform transition-all">
                    
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 border-b border-gray-200 gap-2 sm:gap-0">
                        <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                {initialData ? 'Editar Especie' : 'Nueva Especie'}
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-gray-500">
                                {initialData ? 'Modifica la información de la especie' : 'Ingresa los datos de la nueva especie'}
                            </p>
                        </div>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200 absolute top-4 right-4 sm:relative sm:top-0 sm:right-0"
                            aria-label="Cerrar modal"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-4 sm:px-6 py-6">
                        <div className="space-y-6">
                            
                            <div>
                                <label 
                                    htmlFor="specie-name" 
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Nombre de la Especie <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="specie-name" 
                                    id="specie-name" 
                                    className="w-full px-3 sm:px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm 
                                             placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent 
                                             transition-colors duration-200 outline-none" 
                                    placeholder="Ej: Cerdo" 
                                    required 
                                    value={formData.Specie_Name}
                                    onChange={(e) => setFormData({ ...formData, Specie_Name: e.target.value })}
                                />
                            </div>

                            {/* Footer con botones */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <button 
                                    onClick={onClose}
                                    type="button"
                                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                                             rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                             focus:ring-gray-300 transition-colors duration-200 order-2 sm:order-1"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-cyan-600 rounded-lg 
                                             hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                                             focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed 
                                             transition-colors duration-200 flex items-center justify-center gap-2 order-1 sm:order-2"
                                >
                                    {loading && (
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {loading ? 'Guardando...' : initialData ? 'Guardar cambios' : 'Crear especie'}
                                </button>
                            </div>
                            
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SpeciesModal;