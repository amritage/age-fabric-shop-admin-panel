// src/redux/subsuitablefor/subsuitableforApi.ts
import { apiSlice } from "../api/apiSlice";
import { ISubSuitableFor } from "@/types/subsuitable-type";

export const subsuitableforApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET /subsuitablefor/view
    getAllSubSuitableFor: builder.query<{ data: ISubSuitableFor[] }, void>({
      query: () => `/api/subsuitable/view`,
      providesTags: (res) =>
        res?.data
          ? res.data.map(({ _id }) => ({
              type: "SubSuitableFor" as const,
              id: _id,
            }))
          : [],
    }),

    // GET /subsuitablefor/view/:id
    getSubSuitableFor: builder.query<{ data: ISubSuitableFor }, string>({
      query: (id) => `/api/subsuitable/view/${id}`,
      providesTags: (res, err, id) => [{ type: "SubSuitableFor" as const, id }],
    }),

    // POST /subsuitablefor/add
    addSubSuitableFor: builder.mutation<
      { data: ISubSuitableFor },
      Partial<ISubSuitableFor>
    >({
      query: (body) => ({
        url: `/api/subsuitable/add`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "SubSuitableFor" as const, id: "LIST" }],
    }),

    // PUT /subsuitablefor/update/:id
    updateSubSuitableFor: builder.mutation<
      { data: ISubSuitableFor },
      { id: string; changes: Partial<ISubSuitableFor> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/subsuitable/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "SubSuitableFor" as const, id },
        { type: "SubSuitableFor" as const, id: "LIST" },
      ],
    }),

    // DELETE /subsuitablefor/delete/:id
    deleteSubSuitableFor: builder.mutation<{ status: number }, string>({
      query: (id) => ({
        url: `/api/subsuitable/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "SubSuitableFor" as const, id },
        { type: "SubSuitableFor" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllSubSuitableForQuery,
  useGetSubSuitableForQuery,
  useAddSubSuitableForMutation,
  useUpdateSubSuitableForMutation,
  useDeleteSubSuitableForMutation,
} = subsuitableforApi;
