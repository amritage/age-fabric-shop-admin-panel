import { apiSlice } from "../api/apiSlice";
import { IStructureItem } from "@/types/structure-type";

export const structureApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllStructures: builder.query<{ data: IStructureItem[] }, void>({
      query: () => "/api/structure/view",
      providesTags: (res) =>
        res?.data
          ? res.data.map(({ _id }) => ({ type: "Structure" as const, id: _id }))
          : [],
      keepUnusedDataFor: 600,
    }),

    // Fetch one by ID
    getStructure: builder.query<{ data: IStructureItem }, string>({
      query: (id) => `/api/structure/view/${id}`,
      providesTags: (res, err, id) => [{ type: "Structure" as const, id }],
      keepUnusedDataFor: 300,
    }),

    addStructure: builder.mutation<
      { data: IStructureItem },
      Partial<IStructureItem>
    >({
      query: (data) => ({
        url: "/api/structure/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Structure" as const, id: "LIST" }],
    }),

    updateStructure: builder.mutation<
      { data: IStructureItem },
      { id: string; changes: Partial<IStructureItem> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/structure/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Structure" as const, id },
        { type: "Structure" as const, id: "LIST" },
      ],
    }),

    deleteStructure: builder.mutation<{ status: number }, string>({
      query: (id) => ({
        url: `/api/structure/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "Structure" as const, id },
        { type: "Structure" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllStructuresQuery,
  useGetStructureQuery, // now correctly calls /api/structure/view/:id
  useAddStructureMutation,
  useUpdateStructureMutation,
  useDeleteStructureMutation,
} = structureApi;
