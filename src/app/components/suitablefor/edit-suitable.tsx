"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetSuitableForQuery,
  useUpdateSuitableForMutation,
} from "@/redux/suitablefor/suitableforApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import ErrorMsg from "@/app/components/common/error-msg";
import { ISuitableFor } from "@/types/suitable-for-type";
import { notifySuccess } from "@/utils/toast";

export default function EditSuitableFor({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetSuitableForQuery(id);
  const [updateSuitableFor, { isLoading: isUpdating }] =
    useUpdateSuitableForMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ISuitableFor>({ mode: "onSubmit" });
  // Removed image state and logic

  useEffect(() => {
    if (data) {
      setValue("name", data.data.name);
    }
  }, [data, setValue]);

  const onSubmit = async (vals: ISuitableFor) => {
    await updateSuitableFor({ id, changes: { name: vals.name } }).unwrap();
    notifySuccess("Suitable For updated successfully!");
    router.push("/suitable-for");
  };

  if (isLoading) return <p>Loading…</p>;
  if (isError || !data) return <ErrorMsg msg="Failed to load suitable-for." />;

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
      <button type="submit" disabled={isUpdating} className="tp-btn px-7 py-2">
        {isUpdating ? "Updating…" : "Edit SuitableFor"}
      </button>
    </form>
  );
}
