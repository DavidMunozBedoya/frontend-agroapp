import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Batch, Species, State } from '../types';

interface BatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Batch, 'idBatch' | 'Starting_Date'>) => Promise<void>;
    initialData?: Batch | null;
    species: Species[];
    states: State[];
}

const BatchModal = ({ isOpen, onClose, onSave, initialData, species, states }: BatchModalProps) => {
    const [formData, setFormData] = useState({
        Unit_Cost: '',
        Total_Quantity: '',
        Cost: '',
        Weight_Batch: '',
        Age_Batch: '',
        Species_idSpecies: '',
        States_idStates: '1' // por defecto activo
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                Unit_Cost: initialData.Unit_Cost.toString(),
                Total_Quantity: initialData.Total_Quantity.toString(),
                Cost: initialData.Cost.toString(),
                Weight_Batch: initialData.Weight_Batch.toString(),
                Age_Batch: initialData.Age_Batch.toString(),
                Species_idSpecies: initialData.Species_idSpecies.toString(),
                States_idStates: initialData.States_idStates.toString()
            });
        } else {
            setFormData({
                Unit_Cost: '',
                Total_Quantity: '',
                Cost: '',
                Weight_Batch: '',
                Age_Batch: '',
                Species_idSpecies: '',
                States_idStates: '1'
            });
        }
    }, [initialData, isOpen]);

    // Calcular costo total en tiempo real cuando cambian costo unitario o cantidad
    useEffect(() => {
        const unit = parseFloat(formData.Unit_Cost);
        const qty = parseInt(formData.Total_Quantity);

        if (!isNaN(unit) && !isNaN(qty)) {
            const computed = (unit * qty).toFixed(2);
            setFormData(prev => ({ ...prev, Cost: computed }));
        } else {
            setFormData(prev => ({ ...prev, Cost: '' }));
        }
    }, [formData.Unit_Cost, formData.Total_Quantity]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar que todos los campos estén llenos
        if (!formData.Unit_Cost || !formData.Total_Quantity || !formData.Cost || 
            !formData.Weight_Batch || !formData.Age_Batch || 
            !formData.Species_idSpecies || !formData.States_idStates) {
            alert('Por favor complete todos los campos');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                Unit_Cost: parseFloat(formData.Unit_Cost),
                Total_Quantity: parseInt(formData.Total_Quantity),
                Cost: parseFloat(formData.Cost),
                Weight_Batch: parseFloat(formData.Weight_Batch),
                Age_Batch: parseInt(formData.Age_Batch),
                Species_idSpecies: parseInt(formData.Species_idSpecies),
                States_idStates: parseInt(formData.States_idStates)
            });
            onClose();
        } catch (error) {
            console.error('Error al guardar el lote:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay con blur */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-5 sticky top-0 z-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">
                                {initialData ? 'Editar Lote' : 'Nuevo Lote'}
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                
                                {/* Costo Unitario */}
                                <div className="space-y-2">
                                    <label htmlFor="Unit_Cost" className="text-sm font-semibold text-gray-700 block">
                                        Costo Unitario
                                    </label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        name="Unit_Cost" 
                                        id="Unit_Cost" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                        placeholder="0.00" 
                                        required 
                                        value={formData.Unit_Cost}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Cantidad Total */}
                                <div className="space-y-2">
                                    <label htmlFor="Total_Quantity" className="text-sm font-semibold text-gray-700 block">
                                        Cantidad Total
                                    </label>
                                    <input 
                                        type="number"
                                        name="Total_Quantity" 
                                        id="Total_Quantity" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                        placeholder="0" 
                                        required 
                                        value={formData.Total_Quantity}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Costo Total */}
                                <div className="space-y-2">
                                    <label htmlFor="Cost" className="text-sm font-semibold text-gray-700 block">
                                        Costo Total
                                    </label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        name="Cost" 
                                        id="Cost" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                        placeholder="0.00" 
                                        required 
                                        value={formData.Cost}
                                        readOnly
                                    />
                                </div>

                                {/* Peso del Lote */}
                                <div className="space-y-2">
                                    <label htmlFor="Weight_Batch" className="text-sm font-semibold text-gray-700 block">
                                        Peso del Lote (kg)
                                    </label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        name="Weight_Batch" 
                                        id="Weight_Batch" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                        placeholder="0.00" 
                                        required 
                                        value={formData.Weight_Batch}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Edad del Lote */}
                                <div className="space-y-2">
                                    <label htmlFor="Age_Batch" className="text-sm font-semibold text-gray-700 block">
                                        Edad del Lote (días)
                                    </label>
                                    <input 
                                        type="number"
                                        name="Age_Batch" 
                                        id="Age_Batch" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                        placeholder="0" 
                                        required 
                                        value={formData.Age_Batch}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Especie */}
                                <div className="space-y-2">
                                    <label htmlFor="Species_idSpecies" className="text-sm font-semibold text-gray-700 block">
                                        Especie
                                    </label>
                                    <select
                                        name="Species_idSpecies" 
                                        id="Species_idSpecies" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none cursor-pointer" 
                                        required 
                                        value={formData.Species_idSpecies}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar especie</option>
                                        {species.map((specie) => (
                                            <option key={specie.idSpecies} value={specie.idSpecies}>
                                                {specie.Specie_Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Estado */}
                                <div className="space-y-2">
                                    <label htmlFor="States_idStates" className="text-sm font-semibold text-gray-700 block">
                                        Estado
                                    </label>
                                    <select
                                        name="States_idStates" 
                                        id="States_idStates" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none cursor-pointer" 
                                        required 
                                        value={formData.States_idStates}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar estado</option>
                                        <option value="1">Activo</option>
                                        <option value="2">Inactivo</option>
                                        {states && states.length > 0 && states
                                            .filter(s => s.idStates !== 1 && s.idStates !== 2)
                                            .map((state) => (
                                                <option key={state.idStates} value={state.idStates}>
                                                    {state.State_Name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

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

export default BatchModal;