import { createSlice } from "@reduxjs/toolkit";
import { storage } from "@/utils/storage";

// user type
type IUser = {
  _id: string;
  name: string;
  email: string;
  role?: string | undefined;
  image?: string | undefined;
  phone?: string | undefined;
};
type IAuth = {
  accessToken: string;
  user: IUser;
};

// Check if the cookie exists
const cookieData = storage.getCookie("admin");
let initialAuthState: {
  accessToken: string | undefined;
  user: IUser | undefined;
} = {
  accessToken: undefined,
  user: undefined,
};

// If the cookie exists, parse its value and set it as the initial state
if (cookieData) {
  try {
    const parsedData: { accessToken: string; user: IUser } = cookieData;
    initialAuthState = {
      accessToken: parsedData.accessToken,
      user: parsedData.user,
    };
  } catch (error) {
    // Remove the console.error statement for cleaner production code
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    userLoggedIn: (state, { payload }: { payload: IAuth }) => {
      state.accessToken = payload.accessToken;
      state.user = payload.user;
      
      // Store in both cookie and localStorage for redundancy
      storage.setCookie("admin", {
        accessToken: payload.accessToken,
        user: payload.user,
      }, {
        expires: 0.5,
        secure: true,
        sameSite: "strict",
      });
      
      // Also store in localStorage as backup
      storage.setLocalStorage("admin", {
        accessToken: payload.accessToken,
        user: payload.user,
      });
    },
    userLoggedOut: (state) => {
      state.accessToken = undefined;
      state.user = undefined;
      
      // Remove from both cookie and localStorage
      storage.removeCookie("admin");
      storage.removeLocalStorage("admin");
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
