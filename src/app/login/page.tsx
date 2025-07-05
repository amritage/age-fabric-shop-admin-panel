import OTPLoginForm from "@/forms/otp-login-form";
import LoginForm from "@/forms/login-form";
import login_bg from "@assets/img/bg/login-bg.jpg";
import Link from "next/link";

const LoginPage = () => {
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
                <h4 className="text-[24px] mb-1">Login Now.</h4>
                <p className="mb-2">
                  {"Do not "} have an account?
                  <span>
                    <Link href="/register" className="text-theme">
                      Sign Up
                    </Link>
                  </span>
                </p>
                <p className="text-sm">
                  Prefer OTP login?{" "}
                  <Link href="/otplogin" className="text-theme hover:text-themeDark">
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

export default LoginPage;
