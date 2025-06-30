"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const [sideMenu, setSideMenu] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const localAuth = Cookies.get("admin");
    if (!localAuth) {
      router.push("/login");
    }
  }, [router]);
  return (
    <div className="tp-main-wrapper bg-slate-100 h-screen">
      {/* Sidebar and overlay for mobile */}
      <Sidebar sideMenu={sideMenu} setSideMenu={setSideMenu} />
      {/* Overlay outside sidebar for mobile */}
      <div
        onClick={() => setSideMenu(false)}
        className={`fixed top-0 left-0 w-full h-full z-40 bg-black/70 transition-all duration-300 ${
          sideMenu ? "visible opacity-100" : "invisible opacity-0"
        } lg:hidden`}
      />
      <div className="tp-main-content lg:ml-[250px] xl:ml-[300px] w-[calc(100% - 300px)]">
        {/* header start */}
        <div className="fixed top-0 left-[250px] xl:left-[300px] right-0 z-30 bg-white border-b border-gray-200">
          <Header setSideMenu={setSideMenu} />
        </div>
        {/* header end */}

        <div className="pt-[80px] px-4">
          {/* Adjust pt to match header height */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
