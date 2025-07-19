"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetVendorQuery,
  useUpdateVendorMutation,
} from "@/redux/vendor/vendorApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";
import ErrorMsg from "@/app/components/common/error-msg";
import { IVendor } from "@/types/vendor-type";

interface EditVendorProps {
  id: string;
}

export default function EditVendor({ id }: EditVendorProps) {
  const router = useRouter();

  // 1) Fetch the single vendor
  const {
    data,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetVendorQuery(id || "");

  // 2) Prepare update
  const [updateVendor, { isLoading: isUpdating }] = useUpdateVendorMutation();

  // 3) Hook up form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IVendor>({ mode: "onSubmit" });
  const [img, setImg] = useState("");

  // 4) Prefill when data arrives
  useEffect(() => {
    if (data?.data) {
      setValue("name", data.data.name);
      setImg(data.data.img || "");
    }
  }, [data, setValue]);

  const onSubmit = async (vals: IVendor) => {
    try {
      await updateVendor({
        id: id!,
        changes: { name: vals.name, img },
      }).unwrap();
      router.push("/vendor");
    } catch (e: any) {
      // you could set an error state here
    }
  };

  if (isFetching) return <p>Loading…</p>;
  if (fetchError || !data) return <ErrorMsg msg="Failed to load vendor." />;

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
          placeholder="Enter vendor name"
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
