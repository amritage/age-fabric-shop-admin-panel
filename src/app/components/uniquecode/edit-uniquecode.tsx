// src/app/components/unique-code/EditUniqueCode.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetUniqueCodeQuery,
  useUpdateUniqueCodeMutation,
} from "@/redux/uniquecode/uniquecodeApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import ErrorMsg from "@/app/components/common/error-msg";
import { IUniqueCode } from "@/types/uniquecode-type";

interface EditUniqueCodeProps {
  id: string;
}

export default function EditUniqueCode({ id }: EditUniqueCodeProps) {
  const router = useRouter();

  // 1) Fetch single unique-code
  const {
    data,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetUniqueCodeQuery(id || "");

  // 2) Prepare update
  const [updateUniqueCode, { isLoading: isUpdating }] =
    useUpdateUniqueCodeMutation();

  // 3) Setup form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IUniqueCode>({ mode: "onSubmit" });
  const [img, setImg] = useState("");

  // 4) Prefill on data arrival
  useEffect(() => {
    if (data?.data) {
      setValue("name", data.data.name);
      setImg(data.data.img || "");
    }
  }, [data, setValue]);

  // 5) Submit handler
  const onSubmit = async (vals: IUniqueCode) => {
    try {
      await updateUniqueCode({
        id: id!,
        changes: { name: vals.name, img },
      }).unwrap();
      router.push("/unique-code");
    } catch {
      // handle error if you want
    }
  };

  if (isFetching) return <p>Loading…</p>;
  if (fetchError || !data)
    return <ErrorMsg msg="Failed to load unique-code." />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md space-y-6"
    >
      <GlobalImgUpload image={img} setImage={setImg} isSubmitted={isUpdating} />

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none"
          placeholder="Enter unique code name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

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
