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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full">
            <div className="relative w-full h-full max-w-2xl md:h-auto">
                <div className="bg-white border border-4 rounded-lg shadow relative">
                    
                    <div className="flex items-start justify-between p-5 border-b rounded-t">
                        <h3 className="text-xl font-semibold">
                            {initialData ? 'Editar Especie' : 'Nueva Especie'}
                        </h3>
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6">
                                    <label htmlFor="specie-name" className="text-sm font-medium text-gray-900 block mb-2">Nombre de la Especie</label>
                                    <input 
                                        type="text" 
                                        name="specie-name" 
                                        id="specie-name" 
                                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" 
                                        placeholder="Ej: Cerdo" 
                                        required 
                                        value={formData.Specie_Name}
                                        onChange={(e) => setFormData({ ...formData, Specie_Name: e.target.value })}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6 border-t border-gray-200 rounded-b pt-6">
                                <button 
                                    className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50" 
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Guardando...' : 'Guardar todo'}
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2" 
                                    type="button"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SpeciesModal;
