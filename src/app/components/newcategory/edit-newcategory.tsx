// src/app/components/category/EditCategory.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/newcategory/newcategoryApi";
import { useForm } from "react-hook-form";
import { ICategory } from "@/types/newcategory-type";
import Image from "next/image";

export default function EditCategory() {
  const { id } = useParams();
  const { data, isLoading: isFetching } = useGetCategoryQuery(id || "");
  const [updateCategory, { isLoading: isSubmitting }] =
    useUpdateCategoryMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Pick<ICategory, "name" | "productType" | "parent">>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for image file and preview URL
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  // Prefill form fields and initial preview from fetched data
  useEffect(() => {
    if (data?.data) {
      const { name, productType, parent, image } = data.data;
      setValue("name", name);
      setValue("productType", productType);
      setValue("parent", parent);

      if (image) {
        setPreview(`${BASE}/uploads/${image}`);
      }
    }
  }, [data, setValue, BASE]);

  // When user selects a new file, update preview
  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Handle form submit
  const onSubmit = async (vals: any) => {
    const fd = new FormData();
    fd.append("name", vals.name);
    fd.append("productType", vals.productType);
    fd.append("parent", vals.parent);
    if (file) {
      fd.append("image", file);
    }

    await updateCategory({ id: id!, formData: fd }).unwrap();
    // you can navigate back or show a toast here
  };

  if (isFetching) return <p>Loading…</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="bg-white p-8 rounded-md space-y-6"
    >
      {/* Name */}
      <div>
        <label className="block mb-1">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      {/* Product Type */}
      <div>
        <label className="block mb-1">Product Type</label>
        <input
          {...register("productType", { required: "Required" })}
          className="input w-full"
        />
        {errors.productType && (
          <p className="text-red-500">{errors.productType.message}</p>
        )}
      </div>

      {/* Parent Category */}
      <div>
        <label className="block mb-1">Parent Category</label>
        <input
          {...register("parent", { required: "Required" })}
          className="input w-full"
        />
        {errors.parent && (
          <p className="text-red-500">{errors.parent.message}</p>
        )}
      </div>

      {/* Image Preview + Upload */}
      <div>
        <label className="block mb-1">Image</label>
        {preview ? (
          <Image
            src={preview}
            alt="Category preview"
            width={96}
            height={96}
            unoptimized
            className="mb-2 w-24 h-24 object-cover rounded border"
          />
        ) : (
          <div className="mb-2 w-24 h-24 bg-gray-100 flex items-center justify-center rounded text-gray-400">
            No Image
          </div>
        )}

        {/* File input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-7 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {isSubmitting ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
