"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IDesign } from "@/types/design-type";
import { useAddDesignMutation, useGetAllDesignQuery } from "@/redux/design/designApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import { notifySuccess, notifyError } from "@/utils/toast";

export default function AddDesign() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IDesign>({ mode: "onSubmit" });
  const [addDesign] = useAddDesignMutation();
  const { refetch } = useGetAllDesignQuery();
  // Removed image state and logic

  const onSubmit = async (vals: IDesign) => {
    try {
      await addDesign({ name: vals.name }).unwrap();
      notifySuccess("Design added successfully!");
      await refetch();
      reset();
    } catch (error: any) {
      notifyError(error?.data?.message || "Failed to add design.");
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
          placeholder="Enter design name"
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
        {isSubmitting ? "Adding…" : "Add Design"}
      </button>
    </form>
  );
}
