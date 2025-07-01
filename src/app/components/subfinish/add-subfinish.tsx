"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ISubFinish } from "@/types/subfinish-type";
import { useAddSubFinishMutation } from "@/redux/subfinish/subfinishApi";
// ← Pull in your Finish list, not Structure:
import { useGetAllFinishQuery } from "@/redux/finish/finishApi";
import ErrorMsg from "@/app/components/common/error-msg";

type FormVals = { name: string; finishId: string };

export default function AddSubFinish() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormVals>({ mode: "onSubmit" });

  const [addSF] = useAddSubFinishMutation();
  const { data: finishes, isLoading, isError } = useGetAllFinishQuery();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (vals: FormVals) => {
    setApiError(null);
    try {
      await addSF({ name: vals.name, finishId: vals.finishId }).unwrap();
      reset();
    } catch (err: any) {
      setApiError(err?.data?.message || "Server error – please try again");
    }
  };

  if (isLoading) return <p>Loading finishes…</p>;
  if (isError) return <ErrorMsg msg="Couldn't load finish options" />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md"
    >
      {/* API error banner */}
      {apiError && <p className="mb-4 text-red-600 font-medium">{apiError}</p>}

      {/* Finish dropdown */}
      <div className="mb-6">
        <label className="block mb-1 text-base font-medium">
          Parent Finish
        </label>
        <select
          {...register("finishId", { required: "Select a parent finish" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
        >
          <option value="">Select…</option>
          {finishes?.data.map((f: { _id: string; name: string }) => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
        </select>
        {errors.finishId && (
          <p className="text-red-500 text-sm mt-1">{errors.finishId.message}</p>
        )}
      </div>

      {/* Sub-Finish Name */}
      <div className="mb-6">
        <label className="block mb-1 text-base font-medium">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Enter sub-finish name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="tp-btn px-7 py-2"
      >
        {isSubmitting ? "Adding…" : "Add Sub-Finish"}
      </button>
    </form>
  );
}
