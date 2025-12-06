import { Plus, Eye } from 'lucide-react';

interface Production {
    idProduction: number;
    Batches_idBatches: number;  // ← CAMBIAR AQUÍ (con "s")
    Date_Production: string;
    Avg_Weight: number;
    Total_Weight: number;
    Weight_Cost: number;
    Total_Production: number;
    Batch_Info?: {
        Specie_Name: string;
        Total_Quantity: number;
    };
}

interface Batch {
    idBatch: number;
    Total_Quantity: number;
    Specie_Name?: string;
}

interface ProductionTableProps {
    productions?: Production[];
    batches?: Batch[];
    loading?: boolean;
    onAdd?: () => void;
    onView?: (production: Production) => void;
}

const ProductionTable = ({ 
    productions = [], 
    batches = [],
    loading = false,
    onAdd,
    onView
}: ProductionTableProps) => {
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const getBatchInfo = (batchId: number) => {
        const batch = batches.find(b => b.idBatch === batchId);
        if (batch) {
            return `Lote #${batchId} - ${batch.Specie_Name || 'N/A'}`;
        }
        return `Lote #${batchId}`;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Historial de Producción</h2>
                        <p className="text-sm text-gray-500 mt-1">Registro de ventas de lotes</p>
                    </div>
                    <button 
                        onClick={onAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Registrar Venta
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Lote
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Peso Promedio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Peso Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Precio/kg
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Total Venta
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        <span>Cargando...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : productions.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="font-medium">No hay registros de producción</p>
                                        <p className="text-sm">Registra tu primera venta para comenzar</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            productions.map((production) => (
                                <tr key={production.idProduction} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        #{production.idProduction}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {getBatchInfo(production.Batches_idBatches)}
                                            </span>
                                            {production.Batch_Info && (
                                                <span className="text-xs text-gray-500">
                                                    {production.Batch_Info.Total_Quantity} animales
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {formatDate(production.Date_Production)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <span className="font-medium">{production.Avg_Weight.toFixed(2)}</span> kg
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <span className="font-semibold text-blue-600">
                                            {production.Total_Weight.toFixed(2)}
                                        </span> kg
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        ${production.Weight_Cost.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="font-bold text-green-600 text-base">
                                            {formatCurrency(production.Total_Production)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button 
                                            onClick={() => onView && onView(production)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Ver detalles"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Resumen al final */}
            {productions.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-blue-200 px-6 py-4">
                    <div className="flex justify-end items-center gap-8">
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total Registros</p>
                            <p className="text-lg font-bold text-gray-900">{productions.length}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Peso Total Vendido</p>
                            <p className="text-lg font-bold text-blue-600">
                                {productions.reduce((sum, p) => sum + p.Total_Weight, 0).toFixed(2)} kg
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Ingresos Totales</p>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(productions.reduce((sum, p) => sum + p.Total_Production, 0))}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionTable;