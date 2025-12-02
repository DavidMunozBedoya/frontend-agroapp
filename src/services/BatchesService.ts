import type { Batch } from "../types";

const API_URL = 'http://localhost:3300/batch';

export const batchesService = {
    getAll: async (): Promise<Batch[]> => {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error fetching batches');
        }
        const result = await response.json();
        const data = result.data || result || [];
        // Normalize id field: backend may return idBatches
        return data.map((b: Record<string, unknown>) => {
            const idVal = typeof b['idBatch'] === 'number'
                ? (b['idBatch'] as number)
                : (typeof b['idBatches'] === 'number' ? (b['idBatches'] as number) : 0);
            return ({ ...(b as Record<string, unknown>), idBatch: idVal } as unknown) as Batch;
        });
    },

    create: async (data: Omit<Batch, 'idBatch' | 'Starting_Date'>): Promise<Batch> => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error creating batch');
        }
        return response.json();
    },

    update: async (id: number, data: Omit<Batch, 'idBatch' | 'Starting_Date'>): Promise<Batch> => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error updating batch');
        }
        return response.json();
    },

    delete: async (id: number): Promise<void> => {
        // Logical delete: update state to 2 (Inactivo) via PUT
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            // Try to extract backend message
            let msg = 'Error deleting batch';
            try {
                const json = await response.json();
                msg = json?.message || msg;
            } catch {
                /* ignore */
            }
            throw new Error(msg);
        }
    }
};