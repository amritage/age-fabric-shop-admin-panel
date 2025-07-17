"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetDesignQuery,
  useUpdateDesignMutation,
} from "@/redux/design/designApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import ErrorMsg from "@/app/components/common/error-msg";
import { IDesign } from "@/types/design-type";

interface EditDesignProps {
  id: string;
}

export default function EditDesign({ id }: EditDesignProps) {
  const router = useRouter();

  // Fetch single design by ID
  const {
    data,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetDesignQuery(id || "");

  // Setup update mutation
  const [updateDesign, { isLoading: isUpdating }] = useUpdateDesignMutation();

  // react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IDesign>({ mode: "onSubmit" });

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
  const onSubmit = async (vals: IDesign) => {
    setErrorMessage("");
    try {
      await updateDesign({
        id: id!,
        changes: { name: vals.name, img },
      }).unwrap();
      router.push("/design");
    } catch (err: any) {
      setErrorMessage(err?.data?.message || "Failed to update design.");
    }
  };

  if (isFetching) return <p>Loading…</p>;
  if (fetchError || !data) return <ErrorMsg msg="Failed to load design." />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md space-y-6"
    >
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
          placeholder="Enter design name"
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
        className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isUpdating ? "Updating…" : "Save Changes"}
      </button>
    </form>
  );
}
