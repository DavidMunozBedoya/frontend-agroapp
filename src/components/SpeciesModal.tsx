import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Species {
    idSpecies: number;
    Specie_Name: string;
}

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
            alert('Entrada inválida. Revise su registro');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay con blur */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 sm:mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                                {initialData ? 'Editar Especie' : 'Nueva Especie'}
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
                        <div className="px-6 py-6">
                            <div className="space-y-2">
                                <label 
                                    htmlFor="specie-name" 
                                    className="text-sm font-semibold text-gray-700 block"
                                >
                                    Nombre de la Especie
                                </label>
                                <input 
                                    type="text" 
                                    name="specie-name" 
                                    id="specie-name" 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                    placeholder="Ej: Cerdo" 
                                    required 
                                    value={formData.Specie_Name}
                                    onChange={(e) => setFormData({ ...formData, Specie_Name: e.target.value })}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSubmit(e as React.FormEvent<HTMLInputElement>);
                                        }
                                    }}
                                />
                            </div>
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
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar todo'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SpeciesModal;