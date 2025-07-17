import { apiSlice } from "../api/apiSlice";
import { IDesign } from "@/types/design-type";

export const designApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllDesign: builder.query<{ data: IDesign[] }, void>({
      query: () => "/api/design/view",
      providesTags: (res: { data: IDesign[] } | undefined) =>
        res
          ? [
              { type: "Design" as const, id: "LIST" },
              ...res.data.map((d) => ({ type: "Design" as const, id: d._id })),
            ]
          : [{ type: "Design", id: "LIST" }],
    }),
    getDesign: builder.query<{ data: IDesign }, string>({
      query: (id) => `/api/design/view/${id}`,
      providesTags: (res: { data: IDesign } | undefined, err: unknown, id: string) => [{ type: "Design", id }],
      keepUnusedDataFor: 300,
    }),
    addDesign: builder.mutation<{ data: IDesign }, Partial<IDesign>>({
      query: (body) => ({ url: "/api/design/add", method: "POST", body }),
      invalidatesTags: [{ type: "Design", id: "LIST" }],
    }),
    updateDesign: builder.mutation<
      { data: IDesign },
      { id: string; changes: Partial<IDesign> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/design/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res: { data: IDesign } | undefined, err: unknown, arg: { id: string }) => [
        { type: "Design", id: arg.id },
        { type: "Design", id: "LIST" },
      ],
    }),
    deleteDesign: builder.mutation<{ status: number }, string>({
      query: (id) => ({ url: `/api/design/delete/${id}`, method: "DELETE" }),
      invalidatesTags: (res: { status: number } | undefined, err: unknown, id: string) => [
        { type: "Design", id },
        { type: "Design", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllDesignQuery,
  useGetDesignQuery, // now correctly calls /api/design/view/:id
  useAddDesignMutation,
  useUpdateDesignMutation,
  useDeleteDesignMutation,
} = designApi;
