// src/app/components/subsuitablefor/add-subsuitablefor.tsx
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ISubSuitableFor } from "@/types/subsuitable-type";
import { useAddSubSuitableForMutation } from "@/redux/subsuitablefor/subsuitableApi";
// ← correct import for parent dropdown:
import { useGetAllSuitableForQuery } from "@/redux/suitablefor/suitableforApi";
import ErrorMsg from "@/app/components/common/error-msg";

type FormVals = { name: string; suitableforId: string };

export default function AddSubSuitableFor() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormVals>({ mode: "onSubmit" });

  const [addSSF] = useAddSubSuitableForMutation();
  const { data: parents, isLoading, isError } = useGetAllSuitableForQuery();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (vals: FormVals) => {
    setApiError(null);
    try {
      await addSSF(vals).unwrap();
      reset();
    } catch (err: any) {
      setApiError(err?.data?.message || "Server error");
    }
  };

  if (isLoading) return <p>Loading parent options…</p>;
  if (isError) return <ErrorMsg msg="Failed to load parent options" />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md"
    >
      {apiError && <p className="mb-4 text-red-600">{apiError}</p>}

      <div className="mb-6">
        <label className="block mb-1">Parent SuitableFor</label>
        <select
          {...register("suitableforId", { required: "Select a parent option" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
        >
          <option value="">Select…</option>
          {parents!.data.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.suitableforId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.suitableforId.message}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-1">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Sub-SuitableFor name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <button disabled={isSubmitting} className="tp-btn px-7 py-2">
        {isSubmitting ? "Adding…" : "Add Sub-SuitableFor"}
      </button>
    </form>
  );
}
