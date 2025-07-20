"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ISuitableFor } from "@/types/suitable-for-type";
import { useAddSuitableForMutation, useGetAllSuitableForQuery } from "@/redux/suitablefor/suitableforApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import { notifySuccess, notifyError } from "@/utils/toast";

export default function AddSuitableFor() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ISuitableFor>({ mode: "onSubmit" });
  const [addSuitableFor] = useAddSuitableForMutation();
  const { refetch } = useGetAllSuitableForQuery();
  // Removed image state and logic

  const onSubmit = async (vals: ISuitableFor) => {
    try {
      await addSuitableFor({ name: vals.name }).unwrap();
      notifySuccess("Suitable For added successfully!");
      await refetch();
      reset();
    } catch (error: any) {
      notifyError(error?.data?.message || "Failed to add Suitable For.");
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
          placeholder="Enter suitable-for name"
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
        {isSubmitting ? "Adding…" : "Add SuitableFor"}
      </button>
    </form>
  );
}
