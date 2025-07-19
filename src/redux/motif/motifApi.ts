// src/redux/motif/motifApi.ts
import { apiSlice } from "../api/apiSlice";
import { IMotif } from "@/types/motif-type";

export const motifApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllMotif: builder.query<{ data: IMotif[] }, void>({
      query: () => `/api/motifsize/view`,
      providesTags: (res) =>
        res
          ? [
              { type: "Motif" as const, id: "LIST" },
              ...res.data.map((m) => ({ type: "Motif" as const, id: m._id })),
            ]
          : [{ type: "Motif", id: "LIST" }],
      keepUnusedDataFor: 600,
    }),
    getMotif: builder.query<{ data: IMotif }, string>({
      // Fetch single motif by ID
      query: (id) => `/api/motifsize/view/${id}`,
      providesTags: (res, err, id) => [{ type: "Motif", id }],
      keepUnusedDataFor: 300,
    }),
    addMotif: builder.mutation<{ data: IMotif }, Partial<IMotif>>({
      query: (body) => ({ url: `/api/motifsize/add`, method: "POST", body }),
      invalidatesTags: [{ type: "Motif", id: "LIST" }],
    }),
    updateMotif: builder.mutation<
      { data: IMotif },
      { id: string; changes: Partial<IMotif> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/motifsize/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Motif", id },
        { type: "Motif", id: "LIST" },
      ],
    }),
    deleteMotif: builder.mutation<{ status: number }, string>({
      query: (id) => ({ url: `/api/motifsize/delete/${id}`, method: "DELETE" }),
      invalidatesTags: (res, err, id) => [
        { type: "Motif", id },
        { type: "Motif", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllMotifQuery,
  useGetMotifQuery,
  useAddMotifMutation,
  useUpdateMotifMutation,
  useDeleteMotifMutation,
} = motifApi;
