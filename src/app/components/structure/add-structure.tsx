"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IStructureItem } from "@/types/structure-type";
import { useAddStructureMutation, useGetAllStructuresQuery } from "@/redux/structure/structureApi";

const AddStructure: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IStructureItem>();
  // Removed image state and logic
  const [addStructure] = useAddStructureMutation();
  const { refetch } = useGetAllStructuresQuery();

  const onSubmit = async (data: IStructureItem) => {
    // Removed img from submission
    await addStructure({ ...data });
    await refetch();
    reset();
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
          placeholder="Enter structure name"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>
      <button type="submit" className="tp-btn px-7 py-2">
        Add Structure
      </button>
    </form>
  );
};

export default AddStructure;
