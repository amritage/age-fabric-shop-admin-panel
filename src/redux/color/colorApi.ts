// src/redux/color/colorApi.ts
import { apiSlice } from "../api/apiSlice";
import { IColor } from "@/types/color-type";

export const colorApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // List all
    getAllColor: builder.query<{ data: IColor[] }, void>({
      query: () => "/api/color/view",
      providesTags: (res) =>
        res
          ? [
              { type: "Color" as const, id: "LIST" },
              ...res.data.map((c) => ({ type: "Color" as const, id: c._id! })),
            ]
          : [{ type: "Color", id: "LIST" }],
    }),
    // Get one
    getColor: builder.query<{ data: IColor }, string>({
      query: (id) => `/api/color/view/${id}`,
      providesTags: (res, err, id) => [{ type: "Color", id }],
      keepUnusedDataFor: 300,
    }),
    // Create
    addColor: builder.mutation<{ data: IColor }, Partial<IColor>>({
      query: (body) => ({ url: "/api/color/add", method: "POST", body }),
      invalidatesTags: [{ type: "Color", id: "LIST" }],
    }),
    // Update
    updateColor: builder.mutation<
      { data: IColor },
      { id: string; changes: Partial<IColor> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/color/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Color", id },
        { type: "Color", id: "LIST" },
      ],
    }),
    // Delete
    deleteColor: builder.mutation<{ status: number }, string>({
      query: (id) => ({ url: `/api/color/delete/${id}`, method: "DELETE" }),
      invalidatesTags: (res, err, id) => [
        { type: "Color", id },
        { type: "Color", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllColorQuery,
  useGetColorQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorApi;
