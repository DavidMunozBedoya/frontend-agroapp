// src/components/ExpensesTable.tsx
import { useEffect, useMemo, useState } from "react";
import { Plus, Edit3 } from "lucide-react";
import type { Expense } from "../types";
import { expensesService } from "../services/ExpensesService";
import ExpensesModal from "./ExpensesModal";

export default function ExpensesTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expensesService.getAll();
      setExpenses(data);
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message || "Error al obtener los gastos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadExpenses();
  }, []);

  const totalExpenses = useMemo(
    () =>
      expenses.reduce((acc, exp) => {
        const total = (exp.Cost ?? 0) * (exp.Quantity ?? 0);
        return acc + (isNaN(total) ? 0 : total);
      }, 0),
    [expenses]
  );

  const formatMoney = (value: number) =>
    value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  const handleNew = () => {
    setExpenseToEdit(null);
    setModalOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setExpenseToEdit(expense);
    setModalOpen(true);
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Gestión de Gastos
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Registra los insumos y costos asociados a tus lotes de producción.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {/* Resumen */}
      <div className="px-6 pt-4">
        <div className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-xs font-medium text-blue-800">
          <span>Total de gastos registrados:</span>
          <span>{formatMoney(totalExpenses)}</span>
        </div>
      </div>

      {/* Tabla */}
      <div className="px-6 py-4 overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-500">Cargando gastos...</p>
        ) : error ? (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : expenses.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aún no has registrado gastos. Usa el botón &quot;Agregar&quot; para
            crear el primero.
          </p>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b bg-gray-50">
                <th className="py-2 pr-4 font-semibold">Descripción</th>
                <th className="py-2 px-4 font-semibold">Insumo</th>
                <th className="py-2 px-4 font-semibold">Lote</th>
                <th className="py-2 px-4 font-semibold text-right">
                  Cantidad
                </th>
                <th className="py-2 px-4 font-semibold text-right">
                  Costo unitario
                </th>
                <th className="py-2 px-4 font-semibold text-right">
                  Costo total
                </th>
                <th className="py-2 pl-4 font-semibold text-center">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => {
                const total = (exp.Cost ?? 0) * (exp.Quantity ?? 0);
                return (
                  <tr
                    key={exp.idProduction_Expenses}
                    className="border-b last:border-0 hover:bg-gray-50/60"
                  >
                    <td className="py-2 pr-4 text-gray-900">
                      {exp.Description}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {exp.Supply_Name
                        ? exp.Supply_Name
                        : `#${exp.Supplies_idSupplies}`}
                    </td>
                    <td className="py-2 px-4 text-gray-700">
                      {exp.Batch_Name
                        ? exp.Batch_Name
                        : `Lote #${exp.Batches_idBatches}`}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-900">
                      {exp.Quantity}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-900">
                      {formatMoney(exp.Cost)}
                    </td>
                    <td className="py-2 px-4 text-right font-semibold text-gray-900">
                      {formatMoney(isNaN(total) ? 0 : total)}
                    </td>
                    <td className="py-2 pl-4 text-center">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="inline-flex items-center rounded-full p-1.5 text-blue-600 hover:bg-blue-50"
                        title="Editar gasto"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <ExpensesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        expenseToEdit={expenseToEdit}
        onSaved={loadExpenses}
      />
    </section>
  );
}
