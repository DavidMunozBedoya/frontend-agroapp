
export interface Species {
    idSpecies: number;
    Specie_Name: string;
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



export interface Novelty {
    idNovelties?: number; // Optional for creation
    Quantity: number;
    Description: string;
    Date_Novelty: string;
    Batches_idBatches: number;
    Novelty_Categories_idNovelty_Categories: number;
}
