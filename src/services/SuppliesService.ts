// src/services/SuppliesService.ts
import type { Supply } from "../types";

const API_URL = "http://localhost:3300/supplies"; 

export const suppliesService = {
  getAll: async (): Promise<Supply[]> => {
    const response = await fetch(API_URL);

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
};
