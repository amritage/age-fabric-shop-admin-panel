// src/redux/uniquecode/uniquecodeApi.ts
import { apiSlice } from "../api/apiSlice";
import { IUniqueCode } from "@/types/uniquecode-type";

export const uniquecodeApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllUniqueCodes: builder.query<{ data: IUniqueCode[] }, void>({
      query: () => "/api/uniquecode/view",
      providesTags: (res) =>
        res?.data
          ? res.data.map(({ _id }) => ({
              type: "UniqueCode" as const,
              id: _id,
            }))
          : [],
    }),
    getUniqueCode: builder.query<{ data: IUniqueCode }, string>({
      query: (id) => `/api/uniquecode/view/${id}`,
      providesTags: (res, err, id) => [{ type: "UniqueCode" as const, id }],
      keepUnusedDataFor: 300,
    }),
    addUniqueCode: builder.mutation<
      { data: IUniqueCode },
      Partial<IUniqueCode>
    >({
      query: (body) => ({ url: "/api/uniquecode/add", method: "POST", body }),
      invalidatesTags: [{ type: "UniqueCode", id: "LIST" }],
    }),
    updateUniqueCode: builder.mutation<
      { data: IUniqueCode },
      { id: string; changes: Partial<IUniqueCode> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/uniquecode/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "UniqueCode" as const, id },
        { type: "UniqueCode", id: "LIST" },
      ],
    }),
    deleteUniqueCode: builder.mutation<{ status: number }, string>({
      query: (id) => ({
        url: `/api/uniquecode/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "UniqueCode" as const, id },
        { type: "UniqueCode", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllUniqueCodesQuery,
  useGetUniqueCodeQuery, // ← exported hook for single fetch
  useAddUniqueCodeMutation,
  useUpdateUniqueCodeMutation,
  useDeleteUniqueCodeMutation,
} = uniquecodeApi;
