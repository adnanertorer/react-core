
import api from "../api/axios";
import type { PaginatedResponse } from "../api/responses/PaginatedResponse";
import type { QueryParams } from "../models/QueryParams";
import type { IGenericService } from "./IGenericService";

export class GenericService<TModel> implements IGenericService<TModel> {
  constructor(private basePath: string) {}

  getByFilter = async (
    parentId: string | undefined,
    parentParameterName: string | undefined,
    page: number,
    pageSize: number,
    search: string
  ): Promise<PaginatedResponse<TModel>> => {
    const params: QueryParams = {
      page,
      pageSize,
      search,
    };

   if(page === 0){
      page = page+1;
    }

    const query = new URLSearchParams();

    query.append("pageNumber", page.toString());
    query.append("limit", pageSize.toString());
    query.append("search", search);

    if (parentParameterName) {
      query.append(parentParameterName, parentId!);
    }

    const response = await api.get<PaginatedResponse<TModel>>(
      `${this.basePath}/pagedList?${query.toString()}`,
      { params }
    );

    return response.data;
  };

  remove = (id: string): Promise<void> => {
    return api.post(`${this.basePath}/delete`, { id });
  };
  update = async (model: TModel): Promise<void> => {
    return await api.post(`${this.basePath}/update`, model);
  };

  getById = async (id: string): Promise<TModel> => {
    const response = await api.get(`${this.basePath}/getbyid/?id=${id}`);
    return response.data;
  };

  save = async (model: TModel): Promise<void> => {
    return await api.post(`${this.basePath}/create`, model);
  };
}
