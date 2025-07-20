"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IFinish } from "@/types/finish-type";
import { useAddFinishMutation, useGetAllFinishQuery } from "@/redux/finish/finishApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import { notifySuccess, notifyError } from "@/utils/toast";

export default function AddFinish() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFinish>({ mode: "onSubmit" });
  const [addFinish] = useAddFinishMutation();
  const { refetch } = useGetAllFinishQuery();
  // Removed image state and logic

  const onSubmit = async (vals: IFinish) => {
    try {
      await addFinish({ name: vals.name }).unwrap();
      notifySuccess("Finish added successfully!");
      await refetch();
      reset();
    } catch (error: any) {
      notifyError(error?.data?.message || "Failed to add finish.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md"
    >
      {/* Removed GlobalImgUpload */}
      <div className="mb-6">
        <p className="mb-0 text-base text-black">Name</p>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Enter finish name"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="tp-btn px-7 py-2"
      >
        {isSubmitting ? "Adding…" : "Add Finish"}
      </button>
    </form>
  );
}
