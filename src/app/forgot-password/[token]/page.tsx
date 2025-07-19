"use client";
import React from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAdminConfirmForgotPasswordMutation } from "@/redux/auth/authApi";
import ErrorMsg from "@/app/components/common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";
import Image from "next/image";

// schema
const schema = Yup.object().shape({
  password: Yup.string().required().min(6).label("Password"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), undefined],
    "Passwords must match",
  ),
});

const ForgetPasswordPage = ({ params }: { params: { token: string } }) => {
  const token = params.token;
  const [adminConfirmForgotPassword, {}] =
    useAdminConfirmForgotPasswordMutation();
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  // onSubmit
  const onSubmit = async (data: { password: string }) => {
    const res = await adminConfirmForgotPassword({
      password: data.password,
      token,
    });
    if ("error" in res) {
      if ("data" in res.error) {
        const errorData = res.error.data as { message?: string };
        if (typeof errorData.message === "string") {
          return notifyError(errorData.message);
        }
      }
    } else {
      if ("data" in res) {
        if ("message" in res.data) {
          notifySuccess(res.data.message);
        }
      }
      reset();
    }
  };
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
        {/* Right: Confirm Password Form */}
        <div className="flex-1 flex flex-col justify-center p-10">
          <div className="text-center mb-6">
            <h4 className="text-[24px] mb-1">Confirm Password</h4>
            <p className="mb-4">
              Enter your new password to complete the reset process
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5">
              <p className="mb-0 text-base text-black">
                Password <span className="text-red">*</span>
              </p>
              <input
                {...register("password", {
                  required: `Password is required!`,
                })}
                name="password"
                className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
                type="password"
                placeholder="Enter new password"
                autoComplete="new-password"
              />
              <ErrorMsg msg={errors.password?.message as string} />
            </div>
            <div className="mb-5">
              <p className="mb-0 text-base text-black">
                Confirm Password <span className="text-red">*</span>
              </p>
              <input
                {...register("confirmPassword")}
                name="confirmPassword"
                className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
                type="password"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
              <ErrorMsg msg={errors.confirmPassword?.message as string} />
            </div>
            <button className="tp-btn h-[49px] w-full justify-center">
              Confirm Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
