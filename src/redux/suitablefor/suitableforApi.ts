// src/redux/suitablefor/suitableforApi.ts
import { apiSlice } from "../api/apiSlice";
import { ISuitableFor } from "@/types/suitable-for-type";

export const suitableForApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllSuitableFor: builder.query<{ data: ISuitableFor[] }, void>({
      query: () => "/api/suitablefor/view/",
      providesTags: (res) =>
        res
          ? [
              { type: "SuitableFor" as const, id: "LIST" },
              ...res.data.map((s) => ({
                type: "SuitableFor" as const,
                id: s._id,
              })),
            ]
          : [{ type: "SuitableFor", id: "LIST" }],
    }),
    getSuitableFor: builder.query<{ data: ISuitableFor }, string>({
      // Include the id in the URL:
      query: (id) => `/api/suitablefor/view/${id}`,
      providesTags: (res, err, id) => [{ type: "SuitableFor", id }],
      keepUnusedDataFor: 300,
    }),
    addSuitableFor: builder.mutation<
      { data: ISuitableFor },
      Partial<ISuitableFor>
    >({
      query: (body) => ({ url: "/api/suitablefor/add/", method: "POST", body }),
      invalidatesTags: [{ type: "SuitableFor", id: "LIST" }],
    }),
    updateSuitableFor: builder.mutation<
      { data: ISuitableFor },
      { id: string; changes: Partial<ISuitableFor> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/suitablefor/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "SuitableFor", id },
        { type: "SuitableFor", id: "LIST" },
      ],
    }),
    deleteSuitableFor: builder.mutation<{ status: number }, string>({
      query: (id) => ({
        url: `/api/suitablefor/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "SuitableFor", id },
        { type: "SuitableFor", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllSuitableForQuery,
  useGetSuitableForQuery, // now correctly calls /api/suitablefor/view/:id
  useAddSuitableForMutation,
  useUpdateSuitableForMutation,
  useDeleteSuitableForMutation,
} = suitableForApi;
