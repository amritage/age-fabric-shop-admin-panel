// src/redux/category/categoryApi.ts
import { apiSlice } from "../api/apiSlice";
import { INewCategory } from "@/types/newcategory-type";

export const newcategoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllNewCategories: builder.query<{ data: INewCategory[] }, void>({
      query: () => "/api/newcategory/viewcategory",
      providesTags: (res) =>
        res?.data
          ? res.data.map(({ _id }) => ({ type: "Category" as const, id: _id }))
          : [],
      keepUnusedDataFor: 600,
    }),
    getNewCategory: builder.query<{ data: INewCategory }, string>({
      query: (id) => `/api/newcategory/viewcategory/${id}`,
      providesTags: (res, err, id) => [{ type: "Category" as const, id }],
      keepUnusedDataFor: 300,
    }),
    addNewCategory: builder.mutation<{ data: INewCategory }, FormData>({
      query: (formData) => ({
        url: "/api/newcategory/addcategory",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Category" as const, id: "LIST" }],
    }),
    updateNewCategory: builder.mutation<
      { data: INewCategory },
      { id: string; changes: FormData }
    >({
      query: ({ id, changes }) => ({
        url: `/api/newcategory/update/${id}`,
        method: "PUT",
        body: changes,
      }),
      invalidatesTags: (res, err, { id }) => [
        { type: "Category" as const, id },
        { type: "Category" as const, id: "LIST" },
      ],
    }),
    deleteNewCategory: builder.mutation<{ status: number }, string>({
      query: (id) => ({
        url: `/api/newcategory/deletecategory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (res, err, id) => [
        { type: "Category" as const, id },
        { type: "Category" as const, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllNewCategoriesQuery,
  useGetNewCategoryQuery,
  useAddNewCategoryMutation,
  useUpdateNewCategoryMutation,
  useDeleteNewCategoryMutation,
} = newcategoryApi;
