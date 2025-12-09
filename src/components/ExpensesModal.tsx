// src/components/ExpensesModal.tsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Expense, Batch, Supply } from "../types";
import { batchesService } from "../services/BatchesService";
import { suppliesService } from "../services/SuppliesService";
import { expensesService } from "../services/ExpensesService";

interface ExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit: Expense | null;
  onSaved: () => void;
}

export default function ExpensesModal({
  isOpen,
  onClose,
  expenseToEdit,
  onSaved,
}: ExpensesModalProps) {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const [Supplies_idSupplies, setSuppliesId] = useState<number>(0);
  const [Batches_idBatches, setBatchesId] = useState<number>(0);
  const [Description, setDescription] = useState("");
  const [Cost, setCost] = useState<number>(0);
  const [Quantity, setQuantity] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [suppliesData, batchesData] = await Promise.all([
          suppliesService.getAll(),
          batchesService.getAll(),
        ]);

        setSupplies(suppliesData);
        setBatches(batchesData);

        if (expenseToEdit) {
          setSuppliesId(expenseToEdit.Supplies_idSupplies);
          setBatchesId(expenseToEdit.Batches_idBatches);
          setDescription(expenseToEdit.Description);
          setCost(expenseToEdit.Cost);
          setQuantity(expenseToEdit.Quantity);
        } else {
          setSuppliesId(suppliesData[0]?.idSupplies ?? 0);
          setBatchesId(batchesData[0]?.idBatch ?? 0);
          setDescription("");
          setCost(0);
          setQuantity(0);
        }
      } catch (e: unknown) {
        const err = e as Error;
        setError(err.message || "Error cargando datos del formulario");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [isOpen, expenseToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Supplies_idSupplies || !Batches_idBatches || !Description.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (Cost <= 0 || Quantity <= 0) {
      setError("El costo y la cantidad deben ser mayores que cero.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        Supplies_idSupplies,
        Description: Description.trim(),
        Cost,
        Quantity,
        Batches_idBatches,
      };

      if (expenseToEdit) {
        await expensesService.update(
          expenseToEdit.idProduction_Expenses,
          payload
        );
      } else {
        await expensesService.create(payload);
      }

      onSaved();
      onClose();
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message || "Error al guardar el gasto");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const title = expenseToEdit ? "Editar gasto" : "Registrar gasto";

  const total = Cost * Quantity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500">Cargando datos...</p>
          ) : (
            <>
              {error && (
                <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Insumo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Insumo
                  </label>
                  <select
                    value={Supplies_idSupplies}
                    onChange={(ev) => setSuppliesId(Number(ev.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {supplies.map((s) => (
                      <option key={s.idSupplies} value={s.idSupplies}>
                        {s.Supplie_Name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lote */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lote
                  </label>
                  <select
                    value={Batches_idBatches}
                    onChange={(ev) => setBatchesId(Number(ev.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {batches.map((b) => (
                      <option key={b.idBatch} value={b.idBatch}>
                        Lote #{b.idBatch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={Description}
                  onChange={(ev) => setDescription(ev.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={250}
                  placeholder="Ej: Concentrado inicial, medicamentos, etc."
                />
              </div>

              {/* Cost / Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo unitario
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={Cost}
                    onChange={(ev) => setCost(Number(ev.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={Quantity}
                    onChange={(ev) => setQuantity(Number(ev.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Resumen */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm flex justify-between">
                <span className="font-medium text-gray-600">
                  Total estimado:
                </span>
                <span className="font-semibold text-gray-900">
                  {isNaN(total)
                    ? "$0"
                    : total.toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        maximumFractionDigits: 0,
                      })}
                </span>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting
                ? "Guardando..."
                : expenseToEdit
                ? "Guardar cambios"
                : "Registrar gasto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
