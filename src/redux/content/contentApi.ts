// src/redux/content/contentApi.ts
import { apiSlice } from "../api/apiSlice";
import { IContent } from "@/types/content-type";

export const contentApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllContent: builder.query<{ data: IContent[] }, void>({
      query: () => "/api/content/viewcontent/",
      providesTags: (res) =>
        res
          ? [
              { type: "Content" as const, id: "LIST" },
              ...res.data.map((c) => ({ type: "Content" as const, id: c._id })),
            ]
          : [{ type: "Content", id: "LIST" }],
    }),
    getContent: builder.query<{ data: IContent }, string>({
      // Fetch single content by ID
      query: (id) => `/api/content/viewcontent/${id}`,
      providesTags: (res, err, id) => [{ type: "Content", id }],
    }),
    addContent: builder.mutation<{ data: IContent }, Partial<IContent>>({
      query: (body) => ({
        url: "/api/content/addcontent",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Content", id: "LIST" }],
    }),
    updateContent: builder.mutation<
      { data: IContent },
      { id: string; changes: Partial<IContent> }
    >({
      query: ({ id, changes }) => ({
        url: `/api/content/updatecontent/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Content", id },
        { type: "Content", id: "LIST" },
      ],
    }),
    deleteContent: builder.mutation<{ status: number }, string>({
      query: (id) => ({
        url: `/api/content/deletecontent/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "Content", id },
        { type: "Content", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllContentQuery,
  useGetContentQuery,
  useAddContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
} = contentApi;
