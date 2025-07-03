"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetSubstructureQuery,
  useUpdateSubstructureMutation,
} from "@/redux/substructure/substructureApi";
import { useGetAllStructuresQuery } from "@/redux/structure/structureApi";
import ErrorMsg from "@/app/components/common/error-msg";
import { ISubstructure } from "@/types/substructure-type";
import { IStructureItem } from "@/types/structure-type";

type FormValues = {
  name: string;
  structureId: string;
};

export default function EditSubstructure({ id }: { id: string }) {
  const { data, isLoading, isError } = useGetSubstructureQuery(id);
  const [updateSub, { isLoading: isUpdating }] =
    useUpdateSubstructureMutation();
  const {
    data: structures,
    isLoading: loadStr,
    isError: errStr,
  } = useGetAllStructuresQuery();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onSubmit" });

  // Seed form once data arrives
  useEffect(() => {
    if (data) {
      setValue("name", data.data.name);
      // If structureId is an object, extract the _id
      const structureId =
        data.data.structureId && typeof data.data.structureId === "object"
          ? (data.data.structureId as { _id: string })._id
          : data.data.structureId || "";
      setValue("structureId", structureId);
    }
  }, [data, setValue]);

  const onSubmit = async (vals: FormValues) => {
    await updateSub({
      id,
      changes: { name: vals.name, structureId: vals.structureId },
    }).unwrap();
    router.back();
  };

  if (isLoading || loadStr) return <p>Loading…</p>;
  if (isError) return <ErrorMsg msg="Failed to load substructure." />;
  if (errStr) return <ErrorMsg msg="Failed to load structures." />;

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
            required: "Please select a structure",
          })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
        >
          <option value="">Select a structure</option>
          {structures?.data.map((s: IStructureItem) => (
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

      <button type="submit" disabled={isUpdating} className="tp-btn px-7 py-2">
        {isUpdating ? "Updating…" : "Edit Substructure"}
      </button>
    </form>
  );
}
