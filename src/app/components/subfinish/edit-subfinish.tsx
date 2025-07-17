"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetSubFinishQuery,
  useUpdateSubFinishMutation,
} from "@/redux/subfinish/subfinishApi";
// ← import your Finish list hook instead of Structure
import { useGetAllFinishQuery } from "@/redux/finish/finishApi";
import ErrorMsg from "@/app/components/common/error-msg";
import { ISubFinish } from "@/types/subfinish-type";

type FormVals = {
  name: string;

  finishId: string;
};

export default function EditSubFinish({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetSubFinishQuery(id);
  const [updateSF, { isLoading: isUpdating }] = useUpdateSubFinishMutation();
  const {
    data: finishes,
    isLoading: loadFin,
    isError: errFin,
  } = useGetAllFinishQuery();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormVals>({ mode: "onSubmit" });

  // Seed the form with existing values
  useEffect(() => {
    if (data) {
      setValue("name", data.data.name);
      // If finishId is an object, extract the _id
      const finishId =
        data.data.finishId && typeof data.data.finishId === "object"
          ? (data.data.finishId as { _id: string })._id
          : data.data.finishId || "";
      setValue("finishId", finishId);
    }
  }, [data, setValue]);

  const onSubmit = async (vals: FormVals) => {
    await updateSF({
      id,
      changes: { name: vals.name, finishId: vals.finishId },
    }).unwrap();
    router.back();
  };

  if (isLoading || loadFin) return <p>Loading…</p>;
  if (isError) return <ErrorMsg msg="Failed to load sub-finish" />;
  if (errFin) return <ErrorMsg msg="Failed to load parent finishes" />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md"
    >
      {/* Parent Finish selector */}
      <div className="mb-6">
        <label className="block mb-1 font-medium text-base">
          Parent Finish
        </label>
        <select
          {...register("finishId", {
            required: "Please select a parent finish",
          })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
        >
          <option value="">Select a finish…</option>
          {finishes?.data.map((f: { _id: string; name: string }) => (
            <option key={f._id} value={f._id}>
              {f.name}
            </option>
          ))}
        </select>
        {errors.finishId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.finishId.message}
          </p>
        )}
      </div>

      {/* Sub-Finish Name */}
      <div className="mb-6">
        <label className="block mb-1 font-medium text-base">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Enter sub-finish name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <button type="submit" disabled={isUpdating} className="tp-btn px-7 py-2">
        {isUpdating ? "Updating…" : "Save Changes"}
      </button>
    </form>
  );
}
