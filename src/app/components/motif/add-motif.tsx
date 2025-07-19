"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IMotif } from "@/types/motif-type";
import { useAddMotifMutation, useGetAllMotifQuery } from "@/redux/motif/motifApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import { notifySuccess, notifyError } from "@/utils/toast";

export default function AddMotif() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IMotif>({ mode: "onSubmit" });
  const [addMotif] = useAddMotifMutation();
  const { refetch } = useGetAllMotifQuery();
  const [img, setImg] = useState<string>("");

  const onSubmit = async (vals: IMotif) => {
    try {
      await addMotif({ name: vals.name, img }).unwrap();
      notifySuccess("Motif added successfully!");
      await refetch();
      reset();
      setImg("");
    } catch (error: any) {
      notifyError(error?.data?.message || "Failed to add motif.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md"
    >
      <GlobalImgUpload
        image={img}
        setImage={setImg}
        isSubmitted={isSubmitting}
      />

      <div className="mb-6">
        <p className="mb-0 text-base text-black">Name</p>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Enter motif name"
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
        {isSubmitting ? "Adding…" : "Add Motif"}
      </button>
    </form>
  );
}
