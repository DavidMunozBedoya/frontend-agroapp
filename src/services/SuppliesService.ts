import type { SupplyCategory, SupplyCatalog, Supply } from "../types";

const SUPPLIES_URL = "http://localhost:3300/supplies";

export const suppliesService = {
  // Obtener categorías de suplementos
  getSupplyCategories: async (): Promise<SupplyCategory[]> => {
    const response = await fetch("http://localhost:3300/supplies-category");
    if (!response.ok) {
      throw new Error("Error fetching supply categories");
    }
    const result = await response.json();
    return result.data || result || [];
  },

  // Obtener todos los suplementos
  async getAll(): Promise<Supply[]> {
    const response = await fetch(SUPPLIES_URL);

    // Si el backend responde 404 lo tratamos como "sin insumos"
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }

      const text = await response.text().catch(() => "");
      console.error("Error al obtener suministros:", response.status, text);
      throw new Error("Error al obtener los suministros");
    }

    const result = await response.json();
    const data = result.data ?? result ?? [];
    return data as Supply[];
  },

  // Crear suplemento
  createSupply: async (
    data: Omit<SupplyCatalog, "idSupplies">
  ): Promise<any> => {
    const response = await fetch(SUPPLIES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorJson = JSON.parse(errorText);
        console.error("Error creating supply:", errorJson);
      } catch (e) {
        console.error("Error creating supply:", errorText);
      }
      throw new Error(
        `Error creating supply: ${response.status} - ${errorText}`
      );
    }
    return response.json();
  },

  // Actualizar suplemento
  updateSupply: async (
    id: number,
    data: Partial<SupplyCatalog>
  ): Promise<any> => {
    const response = await fetch(`${SUPPLIES_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error updating supply: ${response.status} - ${errorText}`
      );
    }
    return response.json();
  },

  // Eliminar suplemento
  deleteSupply: async (id: number): Promise<void> => {
    const response = await fetch(`${SUPPLIES_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error deleting supply: ${response.status} - ${errorText}`
      );
    }
  },
};

