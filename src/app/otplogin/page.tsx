"use client";
import OTPLoginForm from "@/forms/otp-login-form";
import Link from "next/link";
import Image from "next/image";

const OTPLoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f8fe]">
      <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <Image
            src="/assets/img/logo/logo.svg"
            alt="Amrita Global Enterprises Logo"
            width={200}
            height={60}
            className="max-w-xs w-full"
          />
        </div>
        {/* Right: OTP Form */}
        <div className="flex-1 flex flex-col justify-center p-10">
          <div className="text-center mb-6">
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
          <OTPLoginForm />
        </div>
      </div>
    </div>
  );
};

export default OTPLoginPage; 