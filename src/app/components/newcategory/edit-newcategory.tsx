// src/app/components/category/EditCategory.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  useGetNewCategoryQuery,
  useUpdateNewCategoryMutation,
} from "@/redux/newcategory/newcategoryApi";
import { useForm } from "react-hook-form";
import { ICategory } from "@/types/newcategory-type";
import GlobalImgUpload from "./global-img-upload";

export default function EditCategory() {
  const { id } = useParams();
  const categoryId = Array.isArray(id) ? id[0] : id || "";
  const { data, isLoading: isFetching, isError: fetchError } = useGetNewCategoryQuery(categoryId);
  const [updateCategory, { isLoading: isSubmitting }] = useUpdateNewCategoryMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Pick<ICategory, "name">>();

  // Local state for image file and url
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!BASE) {
    throw new Error("API base URL is not set. Please configure NEXT_PUBLIC_API_BASE_URL in your environment.");
  }

  // Prefill form fields and initial preview from fetched data
  useEffect(() => {
    if (data?.data) {
      setValue("name", data.data.name);
      // No need to set image here; default_img will handle preview
    }
  }, [data, setValue]);

  // Handle form submit
  const onSubmit = async (vals: any) => {
    setSubmitAttempted(true);
    setErrorMessage("");
    try {
      const fd = new FormData();
      fd.append("name", vals.name);
      if (imageFile) fd.append("image", imageFile);
      await updateCategory({ id: categoryId, changes: fd }).unwrap();
      router.push("/newcategory");
      // Optionally navigate back or show a toast here
    } catch (err: any) {
      setErrorMessage(err?.data?.message || "Failed to update category.");
    }
  };

  if (isFetching) return <p>Loading…</p>;
  if (fetchError || !data) return <p className="text-red-500">Failed to load category.</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Image Upload */}
      <GlobalImgUpload
        setImageFile={setImageFile}
        setImageUrl={setImageUrl}
        isSubmitted={submitAttempted}
        default_img={data?.data?.image || ""}
        imageFile={imageFile}
        imageUrl={imageUrl}
        setIsSubmitted={setSubmitAttempted}
      />

      {/* Name Field */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
          placeholder="Enter category name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Updating…" : "Save Changes"}
      </button>
    </form>
  );
}
