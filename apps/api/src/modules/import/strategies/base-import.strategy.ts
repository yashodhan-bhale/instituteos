export interface ImportRowError {
    row: number;
    errors: string[];
}

export interface ImportResult {
    success: boolean;
    importedCount: number;
    errors?: ImportRowError[];
    message?: string;
}

export abstract class BaseImportStrategy<TEntity = any> {
    abstract propertyName: string; // The format identifier, e.g., "format-1"

    /**
     * Parse the raw excel data into entities or return validation errors
     */
    abstract parseAndValidate(
        data: any[],
        instituteId: string
    ): { entities: TEntity[]; errors: ImportRowError[] };
}
