import { useState, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';

interface Batch {
    idBatch: number;
    Total_Quantity: number;
    Specie_Name?: string;
}


interface ProductionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { 
        Batches_idBatches: number;  // ← Cambiar aquí
        Avg_Weight: number;
        Weight_Cost: number;
    }) => Promise<void>;
    batches: Batch[];
}

const ProductionModal = ({ isOpen, onClose, onSave, batches }: ProductionModalProps) => {
    const [formData, setFormData] = useState({
    Batches_idBatches: '',  // ← Cambiar aquí
    Avg_Weight: '',
    Weight_Cost: ''
});
    const [loading, setLoading] = useState(false);
    
    // Estados para los cálculos en tiempo real
    const [calculations, setCalculations] = useState({
        totalQuantity: 0,
        totalWeight: 0,
        totalProduction: 0
    });

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                Batches_idBatches: '',
                Avg_Weight: '',
                Weight_Cost: ''
            });
            setCalculations({
                totalQuantity: 0,
                totalWeight: 0,
                totalProduction: 0
            });
        }
    }, [isOpen]);

    // Calcular en tiempo real cuando cambien los valores
    useEffect(() => {
        const batchId = parseInt(formData.Batches_idBatches);
        const avgWeight = parseFloat(formData.Avg_Weight) || 0;
        const weightCost = parseFloat(formData.Weight_Cost) || 0;

        if (batchId && avgWeight > 0) {
            const selectedBatch = batches.find(b => b.idBatch === batchId);
            
            if (selectedBatch) {
                const totalQuantity = selectedBatch.Total_Quantity;
                const totalWeight = totalQuantity * avgWeight;
                const totalProduction = totalWeight * weightCost;

                setCalculations({
                    totalQuantity,
                    totalWeight,
                    totalProduction
                });
            }
        } else {
            setCalculations({
                totalQuantity: 0,
                totalWeight: 0,
                totalProduction: 0
            });
        }
    }, [formData.Batches_idBatches, formData.Avg_Weight, formData.Weight_Cost, batches]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!formData.Batches_idBatches || !formData.Avg_Weight || !formData.Weight_Cost) {
            alert('Por favor complete todos los campos');
            return;
        }

        if (parseFloat(formData.Avg_Weight) <= 0) {
            alert('El peso promedio debe ser mayor a 0');
            return;
        }

        if (parseFloat(formData.Weight_Cost) <= 0) {
            alert('El costo por kilo debe ser mayor a 0');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                Batches_idBatches: parseInt(formData.Batches_idBatches),  // ← Cambiar aquí
                Avg_Weight: parseFloat(formData.Avg_Weight),
                Weight_Cost: parseFloat(formData.Weight_Cost)
            });
            onClose();
        } catch (error) {
            console.error('Error al guardar la producción:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const selectedBatch = batches.find(b => b.idBatch === parseInt(formData.Batches_idBatches));

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
                                Registrar Producción
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
                            <div className="space-y-5">
                                
                                {/* Seleccionar Lote */}
                                <div className="space-y-2">
                                    <label htmlFor="Batches_idBatches" className="text-sm font-semibold text-gray-700 block">
                                        Lote a Vender
                                    </label>
                                    <select
                                        name="Batches_idBatches" 
                                        id="Batches_idBatches" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none cursor-pointer" 
                                        required 
                                        value={formData.Batches_idBatches}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar lote</option>
                                        {batches.map((batch) => (
                                            <option key={batch.idBatch} value={batch.idBatch}>
                                                Lote #{batch.idBatch} - {batch.Specie_Name || 'Sin especie'} ({batch.Total_Quantity} animales)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Info del lote seleccionado */}
                                {selectedBatch && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calculator className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm font-semibold text-blue-900">
                                                Información del Lote
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-800">
                                            <span className="font-medium">Cantidad de animales:</span> {selectedBatch.Total_Quantity}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    
                                    {/* Peso Promedio */}
                                    <div className="space-y-2">
                                        <label htmlFor="Avg_Weight" className="text-sm font-semibold text-gray-700 block">
                                            Peso Promedio (kg)
                                        </label>
                                        <input 
                                            type="number"
                                            step="0.01"
                                            name="Avg_Weight" 
                                            id="Avg_Weight" 
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                            placeholder="0.00" 
                                            required 
                                            value={formData.Avg_Weight}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Costo por Kilo */}
                                    <div className="space-y-2">
                                        <label htmlFor="Weight_Cost" className="text-sm font-semibold text-gray-700 block">
                                            Costo por Kilo ($)
                                        </label>
                                        <input 
                                            type="number"
                                            step="0.01"
                                            name="Weight_Cost" 
                                            id="Weight_Cost" 
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 outline-none" 
                                            placeholder="0.00" 
                                            required 
                                            value={formData.Weight_Cost}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>

                                {/* Cálculos en Tiempo Real */}
                                {calculations.totalWeight > 0 && (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 space-y-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Calculator className="w-5 h-5 text-green-600" />
                                            <span className="text-sm font-bold text-green-900">
                                                Cálculos Automáticos
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-700">Peso Total:</span>
                                                <span className="text-lg font-bold text-gray-900">
                                                    {calculations.totalWeight.toFixed(2)} kg
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 text-right">
                                                ({calculations.totalQuantity} animales × {parseFloat(formData.Avg_Weight || '0').toFixed(2)} kg)
                                            </div>
                                            
                                            <div className="h-px bg-green-200 my-2"></div>
                                            
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-700">Total a Cobrar:</span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    ${calculations.totalProduction.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 text-right">
                                                ({calculations.totalWeight.toFixed(2)} kg × ${parseFloat(formData.Weight_Cost || '0').toFixed(2)}/kg)
                                            </div>
                                        </div>
                                    </div>
                                )}

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
                                {loading ? 'Guardando...' : 'Registrar Producción'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductionModal;