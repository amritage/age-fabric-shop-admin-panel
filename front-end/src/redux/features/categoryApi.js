import { apiSlice } from "../api/apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/add`,
        method: "POST",
        body: data, 
      }),
    }),
    getShowCategory: builder.query({
      query: () => "/category/viewcategory"
    }),
    getProductTypeCategory: builder.query({
      query: (type) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/show/${type}`
    }),
  }),
});

export const {
 useAddCategoryMutation,
 useGetProductTypeCategoryQuery,
 useGetShowCategoryQuery,
} = categoryApi;
