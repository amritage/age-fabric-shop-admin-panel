"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { ISubstructure } from "@/types/substructure-type";
import { useAddSubstructureMutation } from "@/redux/substructure/substructureApi";
import { useGetAllStructuresQuery } from "@/redux/structure/structureApi";
import ErrorMsg from "@/app/components/common/error-msg";
import { IStructureItem } from "@/types/structure-type";

type FormValues = {
  name: string;
  structureId: string;
};

export default function AddSubstructure() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<FormValues>({ mode: "onSubmit" });

  const [addSub] = useAddSubstructureMutation();
  const { data: structures, isLoading, isError } = useGetAllStructuresQuery();

  const onSubmit = async (vals: FormValues) => {
    await addSub({ name: vals.name, structureId: vals.structureId }).unwrap();
    reset();
  };

  if (isLoading) return <p>Loading structures…</p>;
  if (isError) return <ErrorMsg msg="Failed to load structures" />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md"
    >
      {/* Structure selector */}
      <div className="mb-6">
        <label className="block mb-1 text-base text-black">
          Parent Structure
        </label>
        <select
          {...register("structureId", {
            required: "You must select a structure",
          })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
        >
          <option value="">Select a structure</option>
          {structures?.data?.map((s: IStructureItem) => (
            <option key={s._id} value={s._id}>
              {s.name || ""}
            </option>
          ))}
        </select>
        {errors.structureId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.structureId.message}
          </p>
        )}
      </div>

      {/* Substructure Name */}
      <div className="mb-6">
        <label className="block mb-1 text-base text-black">
          Substructure Name
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Enter substructure name"
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
        {isSubmitting ? "Adding…" : "Add Substructure"}
      </button>
    </form>
  );
}
