// src/redux/category/categoryApi.ts
import { apiSlice } from "../api/apiSlice";
import { ICategory } from "@/types/newcategory-type";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query<{ data: ICategory[] }, void>({
      // FULL absolute path:
      query: () => "/api/newcategory/viewcategory",
      providesTags: (res) =>
        res
          ? [
              { type: "Category" as const, id: "LIST" },
              ...res.data.map((c) => ({ type: "Category" as const, id: c._id! })),
            ]
          : [{ type: "Category", id: "LIST" }],
    }),
    getCategory: builder.query<{ data: ICategory }, string>({
      query: (id) => `/api/newcategory/viewcategory/${id}`,
      providesTags: (res, err, id) => [{ type: "Category", id }],
    }),
    addCategory: builder.mutation<{ data: ICategory }, FormData>({
      query: (formData) => ({
        url: "/api/newcategory/addcategory",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategory: builder.mutation<
      { data: ICategory },
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/api/newcategory/update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
    deleteCategory: builder.mutation<{ status: number }, string>({
      query: (id) => ({
        url: `/api/newcategory/deletecategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useGetCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
