import { apiSlice } from "../api/apiSlice";
import { IGroupCode } from "@/types/group-code-type";

export const groupCodeApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllGroupCodes: builder.query<{ data: IGroupCode[] }, void>({
      query: () => "/api/groupcode/view",
      providesTags: (res) =>
        res
          ? [
              { type: "GroupCode" as const, id: "LIST" },
              ...res.data.map((u) => ({
                type: "GroupCode" as const,
                id: u._id,
              })),
            ]
          : [{ type: "GroupCode", id: "LIST" }],
    }),
    getGroupCode: builder.query<{ data: IGroupCode }, string>({
      query: (id) => `/api/groupcode/view/${id}`,
      providesTags: (res, err, id) => [{ type: "GroupCode", id }],
      keepUnusedDataFor: 300,
    }),
    addGroupCode: builder.mutation<{ data: IGroupCode }, FormData>({
      query: (body) => ({ url: "/api/groupcode/add", method: "POST", body }),
      invalidatesTags: [{ type: "GroupCode", id: "LIST" }],
    }),
    updateGroupCode: builder.mutation<
      { data: IGroupCode },
      { id: string; changes: Partial<IGroupCode> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/groupcode/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "GroupCode", id },
        { type: "GroupCode", id: "LIST" },
      ],
    }),
    deleteGroupCode: builder.mutation<{ status: number }, string>({
      query: (id) => ({ url: `/api/groupcode/delete/${id}`, method: "DELETE" }),
      invalidatesTags: (res, err, id) => [
        { type: "GroupCode", id },
        { type: "GroupCode", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllGroupCodesQuery,
  useGetGroupCodeQuery,
  useAddGroupCodeMutation,
  useUpdateGroupCodeMutation,
  useDeleteGroupCodeMutation,
} = groupCodeApi;
