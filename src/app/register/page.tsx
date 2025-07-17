import React from "react";
import Link from "next/link";
import RegisterForm from "@/forms/register-form";
import Image from "next/image";

const RegisterPage = () => {
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
        {/* Right: Register Form */}
        <div className="flex-1 flex flex-col justify-center p-10">
          <div className="text-center mb-6">
            <h4 className="text-[24px] mb-1">Register Now</h4>
            <p className="mb-4">
              Create your account to get started with our platform
            </p>
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-theme hover:text-themeDark">
                Sign In
              </Link>
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
