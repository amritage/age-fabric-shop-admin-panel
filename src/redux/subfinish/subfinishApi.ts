// src/redux/subfinish/subfinishApi.ts
import { apiSlice } from "../api/apiSlice";
import { ISubFinish } from "@/types/subfinish-type";

export const subFinishApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllSubFinish: builder.query<{ data: ISubFinish[] }, void>({
      query: () => "/api/subfinish/view",
      providesTags: (res) =>
        res
          ? [
              { type: "SubFinish" as const, id: "LIST" },
              ...res.data.map((sf) => ({
                type: "SubFinish" as const,
                id: sf._id,
              })),
            ]
          : [{ type: "SubFinish", id: "LIST" }],
    }),

    // ✔️ Include the id in the URL
    getSubFinish: builder.query<{ data: ISubFinish }, string>({
      query: (id) => `/api/subfinish/view/${id}`,
      providesTags: (res, err, id) => [{ type: "SubFinish", id }],
    }),

    addSubFinish: builder.mutation<{ data: ISubFinish }, Partial<ISubFinish>>({
      query: (body) => ({ url: "/api/subfinish/add", method: "POST", body }),
      invalidatesTags: [{ type: "SubFinish", id: "LIST" }],
    }),

    updateSubFinish: builder.mutation<
      { data: ISubFinish },
      { id: string; changes: Partial<ISubFinish> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/subfinish/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "SubFinish", id },
        { type: "SubFinish", id: "LIST" },
      ],
    }),

    deleteSubFinish: builder.mutation<{ status: number }, string>({
      query: (id) => ({ url: `/api/subfinish/delete/${id}`, method: "DELETE" }),
      invalidatesTags: (res, err, id) => [
        { type: "SubFinish", id },
        { type: "SubFinish", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllSubFinishQuery,
  useGetSubFinishQuery, // now correctly calls /view/:id
  useAddSubFinishMutation,
  useUpdateSubFinishMutation,
  useDeleteSubFinishMutation,
} = subFinishApi;
