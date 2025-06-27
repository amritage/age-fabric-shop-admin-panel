// src/app/components/category/AddCategory.tsx
"use client";
import React from "react";
import { useRef } from "react";
import { useCategoryForm } from "@/hooks/use-newcategory-form";

export default function AddCategory() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    imageFile,
    setImageFile,
    onAdd,
  } = useCategoryForm();

  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={handleSubmit(onAdd)}
      encType="multipart/form-data"
      className="bg-white p-8 rounded-md space-y-6"
    >
      {/* Name */}
      <div>
        <label className="block mb-1">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full"
          placeholder="Enter category name"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      {/* Product Type */}
      <div>
        <label className="block mb-1">Product Type</label>
        <input
          {...register("productType", { required: "Product Type is required" })}
          className="input w-full"
          placeholder="e.g. Electronics"
        />
        {errors.productType && <p className="text-red-500">{errors.productType.message}</p>}
      </div>

      {/* Parent */}
      <div>
        <label className="block mb-1">Parent Category</label>
        <input
          {...register("parent", { required: "Parent is required" })}
          className="input w-full"
          placeholder="e.g. Gadgets"
        />
        {errors.parent && <p className="text-red-500">{errors.parent.message}</p>}
      </div>

      {/* Image */}
      <div>
        <label className="block mb-1">Image</label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="tp-btn px-7 py-2"
      >
        {isSubmitting ? "Adding…" : "Add Category"}
      </button>
    </form>
  );
}
