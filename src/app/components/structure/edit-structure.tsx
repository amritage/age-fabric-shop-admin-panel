"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetStructureQuery,
  useUpdateStructureMutation,
} from "@/redux/structure/structureApi";
import ErrorMsg from "@/app/components/common/error-msg";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";

interface FormValues {
  name: string;
}

interface EditStructureProps {
  id: string;
  onDone: () => void;
}

export default function EditStructure({ id, onDone }: EditStructureProps) {
  // Fetch one structure by ID
  const {
    data,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetStructureQuery(id || "");

  // Prepare update mutation
  const [updateStructure, { isLoading: isUpdating }] =
    useUpdateStructureMutation();

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const [image, setImage] = useState<string>("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // When data arrives, prefill name and image
  useEffect(() => {
    if (data?.data) {
      setValue("name", data.data.name || "");
      setImage(data.data.img || "");
    }
  }, [data, setValue]);

  const onSubmit = async (values: FormValues) => {
    setSubmitAttempted(true);
    setErrorMessage("");

    try {
      await updateStructure({
        id: id!,
        changes: { name: values.name, img: image },
      }).unwrap();
      onDone();
    } catch (err: any) {
      setErrorMessage(err?.data?.message || "Failed to update structure.");
    }
  };

  if (isFetching) return <p>Loading…</p>;
  if (fetchError || !data) return <ErrorMsg msg="Failed to load structure." />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Image Upload */}
      <GlobalImgUpload
        setImage={setImage}
        isSubmitted={submitAttempted}
        default_img={data.data.img}
        image={image}
        setIsSubmitted={setSubmitAttempted}
      />

      {/* Name Field */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
          placeholder="Enter structure name"
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
        className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isUpdating ? "Updating…" : "Save Changes"}
      </button>
    </form>
  );
}
