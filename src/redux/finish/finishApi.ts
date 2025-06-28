// src/redux/finish/finishApi.ts
import { apiSlice } from "../api/apiSlice";
import { IFinish } from "@/types/finish-type";

export const finishApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllFinish: builder.query<{ data: IFinish[] }, void>({
      query: () => "/api/finish/view",
      providesTags: (res) =>
        res
          ? [
              { type: "Finish" as const, id: "LIST" },
              ...res.data.map((f) => ({ type: "Finish" as const, id: f._id })),
            ]
          : [{ type: "Finish", id: "LIST" }],
    }),
    getFinish: builder.query<{ data: IFinish }, string>({
      // include the ID here
      query: (id) => `/api/finish/view/${id}`,
      providesTags: (res, err, id) => [{ type: "Finish", id }],
      keepUnusedDataFor: 300,
    }),
    addFinish: builder.mutation<{ data: IFinish }, Partial<IFinish>>({
      query: (body) => ({ url: "/api/finish/add", method: "POST", body }),
      invalidatesTags: [{ type: "Finish", id: "LIST" }],
    }),
    updateFinish: builder.mutation<
      { data: IFinish },
      { id: string; changes: Partial<IFinish> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/finish/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Finish", id },
        { type: "Finish", id: "LIST" },
      ],
    }),
    deleteFinish: builder.mutation<{ status: number }, string>({
      query: (id) => ({ url: `/api/finish/delete/${id}`, method: "DELETE" }),
      invalidatesTags: (res, err, id) => [
        { type: "Finish", id },
        { type: "Finish", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllFinishQuery,
  useGetFinishQuery, // now calls /api/finish/view/:id
  useAddFinishMutation,
  useUpdateFinishMutation,
  useDeleteFinishMutation,
} = finishApi;
