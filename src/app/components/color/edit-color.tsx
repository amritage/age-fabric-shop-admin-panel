"use client";
// src/app/components/color/EditColor.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IColor } from "@/types/color-type";
import {
  useGetColorQuery,
  useUpdateColorMutation,
} from "@/redux/color/colorApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import ErrorMsg from "@/app/components/common/error-msg";
import { useParams, useRouter } from "next/navigation";

export default function EditColor() {
  const { id } = useParams();
  const router = useRouter();
  const {
    data,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetColorQuery(Array.isArray(id) ? id[0] : id || "");
  const [updateColor, { isLoading: isUpdating }] = useUpdateColorMutation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IColor>();
  const [img, setImg] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (data?.data) {
      setValue("name", data.data.name);
      setValue("css", data.data.css);
      setImg(data.data.img || "");
    }
  }, [data, setValue]);

  const onSubmit = async (vals: IColor) => {
    setErrorMessage("");
    try {
      await updateColor({
        id: Array.isArray(id) ? id[0] : id || "",
        changes: { name: vals.name, css: vals.css, img },
      }).unwrap();
      router.push("/colors");
    } catch (err: any) {
      setErrorMessage(err?.data?.message || "Failed to update color.");
    }
  };

  if (isFetching) return <p>Loading…</p>;
  if (fetchError || !data) return <ErrorMsg msg="Failed to load color." />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md space-y-6"
    >
      <GlobalImgUpload image={img} setImage={setImg} isSubmitted={isUpdating} />

      <div>
        <p className="mb-0 text-base text-black">Name</p>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Enter color name"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div>
        <p className="mb-0 text-base text-black">CSS Value</p>
        <input
          {...register("css", { required: "CSS value is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="e.g. #ff0000"
        />
        {errors.css && (
          <span className="text-red-500 text-sm">{errors.css.message}</span>
        )}
      </div>

      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isUpdating}
        className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {isUpdating ? "Updating…" : "Save Changes"}
      </button>
    </form>
  );
}
