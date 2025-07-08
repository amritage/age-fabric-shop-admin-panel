import { apiSlice } from "../api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/all`,
    }),
    getProductsByType: builder.query({
      query: ({ type, query }) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/${type}?${query}`,
    }),
    getOfferProducts: builder.query({
      query: (type) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/offer?type=${type}`,
    }),
    getPopularProducts: builder.query({
      query: (type) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/popular/${type}`,
    }),
    getTopRatedProducts: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/top-rated`,
    }),
    // get single product
    getSingleProduct: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/single-product/${id}`,
    }),
    // get related products
    getRelatedProducts: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/related-product/${id}`,
    }),
    getPopularNewProducts: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/newproduct/popular`,
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductsByTypeQuery,
  useGetOfferProductsQuery,
  useGetPopularProductsQuery,
  useGetTopRatedProductsQuery,
  useGetSingleProductQuery,
  useGetRelatedProductsQuery,
  useGetPopularNewProductsQuery,
} = productApi;
