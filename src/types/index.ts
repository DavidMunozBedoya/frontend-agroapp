
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
    Supply_Name?: string;
    Batch_Name?: string;
}