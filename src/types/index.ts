
export interface Species {
    idSpecies: number;
    Specie_Name: string;
}

export interface User {
    idUsers: number;
    user_name: string;
    email_user: string;
    phone_number: string;
    // No incluimos password por seguridad
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    message: string;
    data: User;

}
export interface Category {
    idNovelty_Categories: number;
    Category_Name: string;
}

export interface Lote {
    idBatches: number;
    Starting_Date?: string;
    Unit_Cost?: number;
    Batch_Name?: string;
    // Add other fields as needed
}

export interface State {
    idStates: number;
    State_Name: string;
}

export interface Novelty {
    idNovelties?: number; // Optional for creation
    Quantity: number;
    Description: string;
    Date_Novelty: string;
    Batches_idBatches: number;
    Novelty_Categories_idNovelty_Categories: number;
}

export interface Batch {
    idBatch: number;
    Starting_Date: string;
    Unit_Cost: number;
    Total_Quantity: number;
    Cost: number;
    Weight_Batch: number;
    Age_Batch: number;
    Species_idSpecies: number;
    States_idStates: number;
    Specie_Name?: string;
}

export interface Production {
    idProduction: number;
    Batches_idBatches: number;
    Date_Production: string;
    Avg_Weight: number;
    Total_Weight: number;
    Weight_Cost: number;
    Total_Production: number;
}

// ===== SUPPLIES TYPES =====
export interface SupplyCategory {
    idSupplies_Category: number;
    Category_Name: string;
}

// Catálogo de suplementos disponibles
export interface SupplyCatalog {
    idSupplies?: number;
    Supplie_Name: string; // Note: Backend uses "Supplie_Name" (typo in backend)
    Supplies_Category_idSupplies_Category: number;
}

// Registro de uso de suplementos en lotes
export interface BatchSupply {
    idBatchSupply?: number; // Optional for creation
    Batches_idBatches: number;
    Supplies_idSupplies: number;
    Quantity_Used: number;
    Date_Used: string;
    Notes?: string | null;
}

// ===== PRODUCTION TYPES =====
export interface Production {
    idProduction: number;
    Batches_idBatches: number;
    Date_Production: string;
    Avg_Weight: number;
    Total_Weight: number;
    Weight_Cost: number;
    Total_Production: number;
}

// ===== EXPENSES TYPES =====
export interface Supply {
    idSupplies: number;
    Supply_Name: string;
}

export interface Expense {
    idProduction_Expenses: number;
    Supplies_idSupplies: number;
    Description: string;
    Cost: number;
    Quantity: number;
    Batches_idBatches: number;

    // Opcionales, para cuando el backend haga JOIN y devuelva nombres
    Supplie_Name?: string;
    Batch_Name?: string;
}