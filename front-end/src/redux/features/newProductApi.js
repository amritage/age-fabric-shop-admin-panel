import { apiSlice } from "../api/apiSlice";

export const newProductApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllNewProducts: builder.query({
      query: () => "/newproduct/view",
    }),
    getSingleNewProduct: builder.query({
      query: (id) => `/newproduct/view/${id}`,
    }),
    addNewProduct: builder.mutation({
      query: (data) => ({
        url: "/newproduct/add",
        method: "POST",
        body: data,
      }),
    }),
    updateNewProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/newproduct/update/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteNewProduct: builder.mutation({
      query: (id) => ({
        url: `/newproduct/delete/${id}`,
        method: "DELETE",
      }),
    }),
    searchNewProduct: builder.query({
      query: (q) => `/newproduct/search/${q}`,
    }),
    getGroupCodeProducts: builder.query({
      query: (groupcodeId) => `/newproduct/groupcode/${groupcodeId}`,
    }),
    getCategoryProducts: builder.query({
      query: (id) => `/newproduct/category/${id}`,
    }),
    getStructureProducts: builder.query({
      query: (id) => `/newproduct/structure/${id}`,
    }),
    getContentProducts: builder.query({
      query: (id) => `/newproduct/content/${id}`,
    }),
    getFinishProducts: builder.query({
      query: (id) => `/newproduct/finish/${id}`,
    }),
    getDesignProducts: builder.query({
      query: (id) => `/newproduct/design/${id}`,
    }),
    getColorProducts: builder.query({
      query: (id) => `/newproduct/color/${id}`,
    }),
    getMotifProducts: builder.query({
      query: (id) => `/newproduct/motif/${id}`,
    }),
    getSuitableProducts: builder.query({
      query: (id) => `/newproduct/suitable/${id}`,
    }),
    getVendorProducts: builder.query({
      query: (id) => `/newproduct/vendor/${id}`,
    }),
    getIdentifierProducts: builder.query({
      query: (identifier) => `/newproduct/identifier/${identifier}`,
    }),
    getGsmUpto: builder.query({
      query: (value) => `/newproduct/gsm/upto/${value}`,
    }),
    getOzUpto: builder.query({
      query: (value) => `/newproduct/oz/upto/${value}`,
    }),
    getInchUpto: builder.query({
      query: (value) => `/newproduct/inch/upto/${value}`,
    }),
    getCmUpto: builder.query({
      query: (value) => `/newproduct/cm/upto/${value}`,
    }),
    getPriceUpto: builder.query({
      query: (value) => `/newproduct/price/upto/${value}`,
    }),
    getQuantityUpto: builder.query({
      query: (value) => `/newproduct/quantity/upto/${value}`,
    }),
    getPurchasePriceUpto: builder.query({
      query: (value) => `/newproduct/purchaseprice/upto/${value}`,
    }),
    getGroupCodeById: builder.query({
      query: (id) => `/groupcode/view/${id}`,
    }),
    getPopularNewProducts: builder.query({
      query: () => "/newproduct/popular",
    }),
    getOffers: builder.query({
      query: () => "/newproduct/offers",
    }),
    getTopRated: builder.query({
      query: () => "/newproduct/toprated",
    }),
  }),
});

export const {
  useGetAllNewProductsQuery,
  useGetSingleNewProductQuery,
  useAddNewProductMutation,
  useUpdateNewProductMutation,
  useDeleteNewProductMutation,
  useSearchNewProductQuery,
  useGetGroupCodeProductsQuery,
  useGetCategoryProductsQuery,
  useGetStructureProductsQuery,
  useGetContentProductsQuery,
  useGetFinishProductsQuery,
  useGetDesignProductsQuery,
  useGetColorProductsQuery,
  useGetMotifProductsQuery,
  useGetSuitableProductsQuery,
  useGetVendorProductsQuery,
  useGetIdentifierProductsQuery,
  useGetGsmUptoQuery,
  useGetOzUptoQuery,
  useGetInchUptoQuery,
  useGetCmUptoQuery,
  useGetPriceUptoQuery,
  useGetQuantityUptoQuery,
  useGetPurchasePriceUptoQuery,
  useGetGroupCodeByIdQuery,
  useGetPopularNewProductsQuery,
  useGetOffersQuery,
  useGetTopRatedQuery,
} = newProductApi; 