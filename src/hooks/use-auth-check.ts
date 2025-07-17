"use client";
import { useState, useEffect } from "react";
import { RootState } from "./../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedIn } from "@/redux/auth/authSlice";
import { storage } from "@/utils/storage";

export default function useAuthCheck() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    const localAuth = storage.getCookie("admin");

    if (localAuth) {
      let auth = null;
      try {
        auth = localAuth;
      } catch (e) {
        auth = null;
      }
      if (auth?.accessToken && auth?.user) {
        dispatch(
          userLoggedIn({
            accessToken: auth.accessToken,
            user: auth.user,
          }),
        );
      }
    }
    setAuthChecked(true);
  }, [dispatch, setAuthChecked]);

  return {
    authChecked,
    user,
  };
}
