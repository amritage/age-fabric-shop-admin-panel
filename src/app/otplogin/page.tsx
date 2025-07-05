"use client";
import OTPLoginForm from "@/forms/otp-login-form";
import login_bg from "@assets/img/bg/login-bg.jpg";
import Link from "next/link";

const OTPLoginPage = () => {
  return (
    <div className="tp-main-wrapper h-screen">
      <div className="container mx-auto my-auto h-full flex items-center justify-center">
        <div className="pt-[120px] pb-[120px]">
          <div className="grid grid-cols-12 shadow-lg bg-white overflow-hidden rounded-md ">
            <div className="col-span-4 lg:col-span-6 relative h-full hidden lg:block">
              <div
                className="data-bg absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat"
                data-bg="assets/img/bg/login-bg.jpg"
                style={{ backgroundImage: `url(${login_bg.src})` }}
              ></div>
            </div>
            <div className="col-span-12 lg:col-span-6 md:w-[500px] mx-auto my-auto  pt-[50px] py-[60px] px-5 md:px-[60px]">
              <div className="text-center">
                <h4 className="text-[24px] mb-1">OTP Login</h4>
                <p className="mb-4">
                  Enter your email to receive a one-time password
                </p>
                <p className="text-sm">
                  Prefer password login?{" "}
                  <Link href="/login" className="text-theme hover:text-themeDark">
                    Click here
                  </Link>
                </p>
              </div>
              <div className="">
                <OTPLoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPLoginPage; 