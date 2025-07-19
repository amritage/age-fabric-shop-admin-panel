"use client";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useRequestOTPMutation, useVerifyOTPMutation } from "@/redux/auth/otpApi";
import ErrorMsg from "@/app/components/common/error-msg";
import Link from "next/link";

// schema for email
const emailSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

// schema for OTP
const otpSchema = Yup.object().shape({
  otp: Yup.string().required().length(6).label("OTP"),
});

const OTPLoginForm = () => {
  const [requestOTP, { isLoading: isRequestingOTP }] = useRequestOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
  const router = useRouter();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [canResendOTP, setCanResendOTP] = useState(true);
  const [resendCountdown, setResendCountdown] = useState(0);

  // react hook form for email
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    reset: resetEmail,
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  // react hook form for OTP
  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: otpErrors },
    reset: resetOTP,
  } = useForm({
    resolver: yupResolver(otpSchema),
  });

  // Handle email submission for OTP request
  const onSubmitEmail = async (data: { email: string }) => {
    try {
      const res = await requestOTP({ email: data.email });
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
        notifyError("Failed to send OTP");
      } else {
        setUserEmail(data.email);
        setShowOTPModal(true);
        setCanResendOTP(false);
        setResendCountdown(60);
        notifySuccess("OTP sent to your email successfully");
        resetEmail();
        
        // Start countdown for resend
        const timer = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              setCanResendOTP(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  // Handle OTP verification
  const onSubmitOTP = async (data: { otp: string }) => {
    try {
      const res = await verifyOTP({ 
        email: userEmail, 
        otp: data.otp 
      });
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
        notifyError("Invalid OTP");
      } else {
        notifySuccess("Login successful");
        setShowOTPModal(false);
        resetOTP();
        router.push("/dashboard");
      }
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  // Close modal
  const closeModal = () => {
    setShowOTPModal(false);
    resetOTP();
    setCanResendOTP(true);
    setResendCountdown(0);
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      const res = await requestOTP({ email: userEmail });
      if ("error" in res) {
        if ("data" in res.error) {
          const errorData = res.error.data as { message?: string };
          if (typeof errorData.message === "string") {
            return notifyError(errorData.message);
          }
        }
        notifyError("Failed to resend OTP");
      } else {
        setCanResendOTP(false);
        setResendCountdown(60);
        notifySuccess("OTP resent successfully");
        
        // Start countdown for resend
        const timer = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              setCanResendOTP(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      notifyError("Something went wrong");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
        <div className="mb-5">
          <p className="mb-0 text-base text-black">
            Email <span className="text-red">*</span>
          </p>
          <input
            {...registerEmail("email", { required: `Email is required!` })}
            name="email"
            id="email"
            className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base"
            type="email"
            placeholder="Enter Your Email"
          />
          <ErrorMsg msg={emailErrors.email?.message as string} />
        </div>
        <button 
          type="submit" 
          className="tp-btn h-[49px] w-full justify-center"
          disabled={isRequestingOTP}
        >
          {isRequestingOTP ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Enter OTP</h3>
              <p className="text-gray-600">
                We&apos;ve sent a 6-digit code to <strong>{userEmail}</strong>
              </p>
            </div>
            
            <form onSubmit={handleSubmitOTP(onSubmitOTP)}>
              <div className="mb-5">
                <p className="mb-0 text-base text-black">
                  OTP <span className="text-red">*</span>
                </p>
                <input
                  {...registerOTP("otp", { required: `OTP is required!` })}
                  name="otp"
                  id="otp"
                  className="input w-full h-[49px] rounded-md border border-gray6 px-6 text-base text-center text-lg tracking-widest"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  inputMode="numeric"
                />
                <ErrorMsg msg={otpErrors.otp?.message as string} />
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="tp-btn-outline h-[49px] flex-1 justify-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="tp-btn h-[49px] flex-1 justify-center"
                  disabled={isVerifyingOTP}
                >
                  {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn&apos;t receive the code?
                </p>
                {canResendOTP ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-theme hover:text-themeDark text-sm font-medium"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-sm text-gray-500">
                    Resend OTP in {resendCountdown}s
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OTPLoginForm; 