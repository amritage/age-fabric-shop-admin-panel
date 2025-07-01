import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { storage } from "@/utils/storage";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      try {
        const userInfo = storage.getCookie("admin");
        if (userInfo) {
          const { accessToken } = userInfo;
          if (accessToken)
            headers.set("Authorization", `Bearer ${accessToken}`);
        }
      } catch {
        // ignore
      }
      return headers;
    },
  }),
  tagTypes: [
    "DashboardAmount",
    "DashboardSalesReport",
    "DashboardMostSellingCategory",
    "DashboardRecentOrders",
    "AllProducts",
    "StockOutProducts",
    "AllCategory",
    "AllBrands",
    "getCategory",
    "AllOrders",
    "getBrand",
    "ReviewProducts",
    "AllCoupons",
    "Coupon",
    "AllStaff",
    "Stuff",
    "AllFilters",
    "getFilter",
    "Product",
    "GroupCode",
    "SuitableFor",
    "Color",
    "Content",
    "Design",
    "Finish",
    "Motif",
    "Category",
    "SubFinish",
    "Substructure",
    "SubSuitableFor",
    "UniqueCode",
    "Vendor",
    "Structure",
  ],
  endpoints: () => ({}),
});
