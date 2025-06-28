import { apiSlice } from "../api/apiSlice";

export const newProductApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllNewProducts: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/view`,
      providesTags: ['NewProducts']
    }),
    getNewProduct: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/view/${id}`,
      providesTags: (result, error, id) => [{ type: "NewProducts", id }],
    }),
    addNewProduct: builder.mutation({
      query: (formData) => ({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/add`,
        method: 'POST',
        body: formData,
      }),
    }),
    updateNewProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/update/${id}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    deleteNewProduct: builder.mutation({
      query: (id) => ({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    searchNewProducts: builder.query({
      query: (q) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/search/${q}`,
    }),
    getProductsByGroupCode: builder.query({
      query: (groupcodeId) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/groupcode/${groupcodeId}`,
    }),
    getProductsByCategoryId: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/category/${id}`,
    }),
    getProductsByStructureId: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/structure/${id}`,
    }),
    getProductsByContentId: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/content/${id}`,
    }),
    getProductsByFinishId: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/finish/${id}`,
    }),
    getProductsByDesignId: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/design/${id}`,
    }),
    getProductsByColorId: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/color/${id}`,
    }),
    getProductsByMotifSizeId: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/motif/${id}`,
    }),
    getProductsBySuitableForId: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/suitable/${id}`,
    }),
    getProductsByVendorId: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/vendor/${id}`,
    }),
    getProductByIdentifier: builder.query({
      query: (identifier) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/identifier/${identifier}`,
    }),
    getProductsByGsmValue: builder.query({
      query: (value) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/gsm/upto/${value}`,
    }),
    getProductsByOzValue: builder.query({
      query: (value) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/oz/upto/${value}`,
    }),
    getProductsByInchValue: builder.query({
      query: (value) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/inch/upto/${value}`,
    }),
    getProductsByCmValue: builder.query({
      query: (value) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/cm/upto/${value}`,
    }),
    getProductsByPriceValue: builder.query({
      query: (value) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/price/upto/${value}`,
    }),
    getProductsByQuantityValue: builder.query({
      query: (value) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/quantity/upto/${value}`,
    }),
    getProductsByPurchasePriceValue: builder.query({
      query: (value) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/purchaseprice/upto/${value}`,
    }),
    getGroupCodeById: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/groupcode/view/${id}`,
    }),
    getPopularNewProducts: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/popular`,
      providesTags: ["PopularNewProducts"],
    }),
    getOfferNewProducts: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/offers`,
      providesTags: ["OfferNewProducts"],
    }),
    getTopRatedNewProducts: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/newproduct/toprated`,
      providesTags: ["TopRatedNewProducts"],
    }),
  }),
});

export const {
  useGetAllNewProductsQuery,
  useGetNewProductQuery,
  useAddNewProductMutation,
  useUpdateNewProductMutation,
  useDeleteNewProductMutation,
  useSearchNewProductsQuery,
  useGetProductsByGroupCodeQuery,
  useGetProductsByCategoryIdQuery,
  useGetProductsByStructureIdQuery,
  useGetProductsByContentIdQuery,
  useGetProductsByFinishIdQuery,
  useGetProductsByDesignIdQuery,
  useGetProductsByColorIdQuery,
  useGetProductsByMotifSizeIdQuery,
  useGetProductsBySuitableForIdQuery,
  useGetProductsByVendorIdQuery,
  useGetProductByIdentifierQuery,
  useGetProductsByGsmValueQuery,
  useGetProductsByOzValueQuery,
  useGetProductsByInchValueQuery,
  useGetProductsByCmValueQuery,
  useGetProductsByPriceValueQuery,
  useGetProductsByQuantityValueQuery,
  useGetProductsByPurchasePriceValueQuery,
  useGetGroupCodeByIdQuery,
  useGetPopularNewProductsQuery,
  useGetOfferNewProductsQuery,
  useGetTopRatedNewProductsQuery,
} = newProductApi; 