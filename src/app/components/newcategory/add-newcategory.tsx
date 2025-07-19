// src/app/components/category/AddCategory.tsx
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAddNewCategoryMutation } from "@/redux/newcategory/newcategoryApi";

export default function AddNewCategory() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [addNewCategory] = useAddNewCategoryMutation();

  const onSubmit = async (data: any) => {
    const fd = new FormData();
    fd.append("name", data.name);
    if (imageFile) {
      fd.append("image", imageFile);
    }
    await addNewCategory(fd);
    reset();
    setImageFile(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 py-8 rounded-md">
      <div className="mb-6">
        <p className="mb-1 text-base text-black">Upload Image</p>
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>
      <div className="mb-6">
        <p className="mb-0 text-base text-black">Name</p>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Enter category name"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{typeof errors.name.message === "string" ? errors.name.message : ""}</span>
        )}
      </div>
      <button type="submit" className="tp-btn px-7 py-2">
        Add Category
      </button>
    </form>
  );
}
