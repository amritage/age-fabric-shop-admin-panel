"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IStructureItem } from "@/types/structure-type";
import { useAddStructureMutation } from "@/redux/structure/structureApi";
import GlobalImgUpload from "../category/global-img-upload"; // Reuse if possible

const AddStructure: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IStructureItem>();
  const [img, setImg] = useState<string>("");
  const [addStructure] = useAddStructureMutation();

  const onSubmit = async (data: IStructureItem) => {
    await addStructure({ ...data, img });
    reset();
    setImg("");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md"
    >
      <GlobalImgUpload image={img} setImage={setImg} isSubmitted={false} />
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
