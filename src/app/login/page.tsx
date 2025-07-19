import LoginForm from "@/forms/login-form";
import Link from "next/link";
import Image from "next/image";

const LoginPage = () => {
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
        {/* Right: Login Form */}
        <div className="flex-1 flex flex-col justify-center p-10">
          <div className="text-center mb-6">
            <h4 className="text-[24px] mb-1">Login Now</h4>
            <p className="mb-4">
              Welcome back! Please enter your credentials to access your account
            </p>
            <p className="text-sm">
              Do not have an account?{" "}
              <Link href="/register" className="text-theme hover:text-themeDark">
                Sign Up
              </Link>
            </p>
            <p className="text-sm mt-2">
              Prefer OTP login?{" "}
              <Link href="/otplogin" className="text-theme hover:text-themeDark">
                Click here
              </Link>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
