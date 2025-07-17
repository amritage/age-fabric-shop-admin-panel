// src/app/components/subsuitablefor/edit-subsuitablefor.tsx
"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetSubSuitableForQuery,
  useUpdateSubSuitableForMutation,
} from "@/redux/subsuitablefor/subsuitableApi";
// ← RIGHT hook for parent dropdown:
import { useGetAllSuitableForQuery } from "@/redux/suitablefor/suitableforApi";
import ErrorMsg from "@/app/components/common/error-msg";

type FormVals = { name: string; suitableforId: string };

export default function EditSubSuitableFor({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetSubSuitableForQuery(id);
  const [updateSSF, { isLoading: isUpdating }] =
    useUpdateSubSuitableForMutation();
  const {
    data: parents,
    isLoading: lp,
    isError: pe,
  } = useGetAllSuitableForQuery();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormVals>({ mode: "onSubmit" });

  useEffect(() => {
    if (data) {
      setValue("name", data.data.name);
      // If suitableforId is an object, extract the _id
      const suitableforId =
        data.data.suitableforId && typeof data.data.suitableforId === "object"
          ? (data.data.suitableforId as { _id: string })._id
          : data.data.suitableforId || "";
      setValue("suitableforId", suitableforId);
    }
  }, [data, setValue]);

  const onSubmit = async (vals: FormVals) => {
    await updateSSF({ id, changes: vals }).unwrap();
    router.back();
  };

  if (isLoading || lp) return <p>Loading…</p>;
  if (isError) return <ErrorMsg msg="Failed to load item" />;
  if (pe) return <ErrorMsg msg="Failed to load parent options" />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md"
    >
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

      <button disabled={isUpdating} className="tp-btn px-7 py-2">
        {isUpdating ? "Updating…" : "Edit Sub-SuitableFor"}
      </button>
    </form>
  );
}
