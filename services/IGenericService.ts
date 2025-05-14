import type { PaginatedResponse } from "../api/responses/PaginatedResponse";


export interface IGenericService<T>{
    getByFilter:(
        parentId: string | undefined,
        parentParameterName: string | undefined,
        page: number,
        pageSize: number,
        search: string | ""
    ) => Promise<PaginatedResponse<T>>;

    remove: (id: string) => Promise<void>;
    update: (model: T) => Promise<void>;
    getById: (id: string) => Promise<T>;
    save: (model: T) => Promise<void>;
}