import type { Production } from "../types";

const API_URL = 'http://localhost:3300/productions';

// Interfaz para lo que devuelve el backend (con strings)
interface ProductionResponse {
    idProduction: number;
    Batches_idBatches: number;
    Date_Production: string;
    Avg_Weight: string;
    Total_Weight: string;
    Weight_Cost: string;
    Total_Production: string;
}

export const productionService = {
    getAll: async (): Promise<Production[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error fetching productions');
        }
        const result = await response.json();
        // Convertir strings a números
        const productions: ProductionResponse[] = result.data || [];
        return productions.map((p) => ({
            ...p,
            Avg_Weight: parseFloat(p.Avg_Weight),
            Total_Weight: parseFloat(p.Total_Weight),
            Weight_Cost: parseFloat(p.Weight_Cost),
            Total_Production: parseFloat(p.Total_Production)
        }));
    },

    create: async (data: {
        Batches_idBatches: number;
        Avg_Weight: number;
        Weight_Cost: number;
    }): Promise<Production> => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error creating production');
        }
        const result = await response.json();
        return result.data || result;
    }
};