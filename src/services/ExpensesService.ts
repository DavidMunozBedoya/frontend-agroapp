// src/services/ExpensesService.ts
import type { Expense } from "../types";

const API_URL = "http://localhost:3300/production-expenses";

export const expensesService = {
  getAll: async (): Promise<Expense[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }

      const text = await response.text().catch(() => "");
      console.error("Error al obtener gastos:", response.status, text);

      throw new Error(`Error al obtener los gastos (HTTP ${response.status})`);
    }

    const result = await response.json();
    const data = result.data ?? result ?? [];
    return data as Expense[];
  },

  getById: async (id: number): Promise<Expense> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener el gasto");
    }
    const result = await response.json();
    return (result.data || result) as Expense;
  },

  create: async (
    payload: Omit<Expense, "idProduction_Expenses">
  ): Promise<Expense> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || "Error al crear el gasto");
    }
    const result = await response.json();
    return (result.data || result) as Expense;
  },

  update: async (
    id: number,
    payload: Omit<Expense, "idProduction_Expenses">
  ): Promise<Expense> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message || "Error al actualizar el gasto");
    }
    const result = await response.json();
    return (result.data || result) as Expense;
  },
};
