import { storage } from "@/utils/storage";
import { apiSlice } from "@/redux/api/apiSlice";
import { userLoggedIn } from "./authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Types for OTP
export interface IOTPRequest {
  email: string;
}

export interface IOTPVerify {
  email: string;
  otp: string;
}

export interface IOTPResponse {
  message: string;
  success: boolean;
}

export interface IOTPVerifyResponse {
  _id: string;
  token: string;
  name: string;
  image?: string;
  email: string;
  phone?: string;
  role?: string;
}

// Create a separate API slice for OTP with external URL
export const otpApiSlice = createApi({
  reducerPath: "otpApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://adorable-gentleness-production.up.railway.app",
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
  tagTypes: [],
  endpoints: () => ({}),
});

export const otpApi = otpApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Request OTP
    requestOTP: builder.mutation<IOTPResponse, IOTPRequest>({
      query: (data) => ({
        url: "/api/loginotp/request",
        method: "POST",
        body: data,
      }),
    }),
    
    // Verify OTP
    verifyOTP: builder.mutation<IOTPVerifyResponse, IOTPVerify>({
      query: (data) => ({
        url: "/api/loginotp/verify",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const { token, ...others } = result.data;
          storage.setCookie("admin", {
            accessToken: token,
            user: others,
          }, { expires: 0.5, secure: true, sameSite: "strict" });
          storage.setLocalStorage("admin", {
            accessToken: token,
            user: others,
          });

          dispatch(
            userLoggedIn({
              accessToken: token,
              user: others,
            }),
          );
        } catch (err) {
          // do nothing
        }
      },
    }),
  }),
});

export const {
  useRequestOTPMutation,
  useVerifyOTPMutation,
} = otpApi; 