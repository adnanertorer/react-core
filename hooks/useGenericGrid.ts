import { useState } from "react";
import type { GridPaginationModel, GridRowId } from "@mui/x-data-grid";
import { useDebounce } from "./useDebounce";
import type { IGenericService } from "../services/IGenericService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResponse } from "../api/responses/PaginatedResponse";

interface UseGenericQueryGridProps<T, P> {
  service: IGenericService<T>;
  parentId?: string;
  debounceDelay?: number;
  parentService?: IGenericService<P>;
  parentParameterName?: string;
}

export const UseGenericQueryGrid = <T extends { id: string | undefined }, P>({
  service,
  parentId,
  debounceDelay = 300,
  parentService,
  parentParameterName,
}: UseGenericQueryGridProps<T, P>) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [searchText, setSearchText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<GridRowId | null>(
    null
  );
  const [editingState, setEditingState] = useState<T | null>(null);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>(
    parentId || undefined
  );

  const debouncedSearchText = useDebounce(searchText, debounceDelay);
  const queryClient = useQueryClient();

  const {
    data: listData,
    isLoading: listLoading,
    refetch: listRefresh,
  } = useQuery<PaginatedResponse<T>>({
    queryKey: [
      "list",
      selectedParentId,
      debouncedSearchText,
      paginationModel.page,
      paginationModel.pageSize,
    ],
    queryFn: async (): Promise<PaginatedResponse<T>> => {
      return service.getByFilter(
        selectedParentId,
        parentParameterName,
        paginationModel.page,
        paginationModel.pageSize,
        debouncedSearchText
      );
    },
    enabled: true,
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: GridRowId) => service.remove(id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (model: T) => service.update(model),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list"] });
      setOpenEditDrawer(false);
    },
  });

  const { data: parentData } = useQuery<P | null>({
    queryKey: ["parent", selectedParentId],
    queryFn: async (): Promise<P | null> => {
      if (!parentService || !selectedParentId) return null;
      return await parentService.getById(selectedParentId);
    },
    enabled: !!selectedParentId && !!parentService,
    staleTime: 1000 * 60,
  });

  return {
    rows: listData?.pageItems ?? [],
    rowCount: listData?.totalCount ?? 0,
    paginationModel,
    searchText,
    confirmDeleteId,
    editingState,
    openEditDrawer,
    loading: listLoading,
    selectedParentId,
    setPaginationModel,
    setSearchText,
    setConfirmDeleteId,
    setEditingState,
    setOpenEditDrawer,
    setSelectedParentId,
    parentData,
    refresh: listRefresh,
    handleDelete: (id: GridRowId) => deleteMutation.mutate(id),
    handleEditSave: (model: T) => updateMutation.mutate(model)
  };
};
