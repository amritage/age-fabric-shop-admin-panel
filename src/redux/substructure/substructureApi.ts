// src/redux/substructure/substructureApi.ts
import { apiSlice } from "../api/apiSlice";
import { ISubstructure } from "@/types/substructure-type";

export const substructureApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Fetch all
    getAllSubstructures: builder.query<{ data: ISubstructure[] }, void>({
      query: () => "/api/substructure/view",
      providesTags: (res) =>
        res?.data
          ? res.data.map(({ _id }) => ({
              type: "Substructure" as const,
              id: _id,
            }))
          : [],
      keepUnusedDataFor: 600,
    }),

    // **Fetch one by ID**
    getSubstructure: builder.query<{ data: ISubstructure }, string>({
      query: (id) => `/api/substructure/view/${id}`,
      providesTags: (res, err, id) => [{ type: "Substructure" as const, id }],
      keepUnusedDataFor: 300,
    }),

    // Create
    addSubstructure: builder.mutation<
      { data: ISubstructure },
      Partial<ISubstructure>
    >({
      query: (body) => ({ url: "/api/substructure/add", method: "POST", body }),
      invalidatesTags: [{ type: "Substructure" as const, id: "LIST" }],
    }),

    // Update
    updateSubstructure: builder.mutation<
      { data: ISubstructure },
      { id: string; changes: Partial<ISubstructure> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/substructure/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Substructure" as const, id },
        { type: "Substructure" as const, id: "LIST" },
      ],
    }),

    // Delete
    deleteSubstructure: builder.mutation<{ status: number }, string>({
      query: (id) => ({
        url: `/api/substructure/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "Substructure" as const, id },
        { type: "Substructure" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllSubstructuresQuery,
  useGetSubstructureQuery, // now correctly calls /view/:id
  useAddSubstructureMutation,
  useUpdateSubstructureMutation,
  useDeleteSubstructureMutation,
} = substructureApi;
