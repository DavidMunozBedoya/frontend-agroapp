const SpeciesTable = () => {
    return ( 
        <>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Gestión de Especies</h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Agregar
                    </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nombre de especie</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr>
                        <td colSpan={2} className="px-6 py-12 text-center text-gray-500">
                            No hay datos disponibles
                        </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </>
     );
}
 
export default SpeciesTable;