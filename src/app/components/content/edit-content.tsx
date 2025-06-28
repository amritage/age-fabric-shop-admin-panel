"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetContentQuery,
  useUpdateContentMutation,
} from "@/redux/content/contentApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import ErrorMsg from "@/app/components/common/error-msg";
import { IContent } from "@/types/content-type";

interface EditContentProps {
  id: string;
  onDone: () => void;
}

export default function EditContent({ id, onDone }: EditContentProps) {
  // Fetch single content by ID
  const {
    data,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetContentQuery(id || "");

  // Setup update mutation
  const [updateContent, { isLoading: isUpdating }] = useUpdateContentMutation();

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IContent>({ mode: "onSubmit" });

  const [img, setImg] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Prefill form when data arrives
  useEffect(() => {
    if (data?.data) {
      setValue("name", data.data.name);
      setImg(data.data.img || "");
    }
  }, [data, setValue]);

  // Submit handler
  const onSubmit = async (vals: IContent) => {
    setErrorMessage("");
    try {
      await updateContent({
        id: id!,
        changes: { name: vals.name, img },
      }).unwrap();
      onDone();
    } catch (err: any) {
      setErrorMessage(err?.data?.message || "Failed to update content.");
    }
  };

  if (isFetching) return <p>Loading…</p>;
  if (fetchError || !data) return <ErrorMsg msg="Failed to load content." />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Image Upload */}
      <GlobalImgUpload image={img} setImage={setImg} isSubmitted={isUpdating} />

      {/* Name Field */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none"
          placeholder="Enter content name"
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
        disabled={isUpdating}
        className="w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {isUpdating ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
