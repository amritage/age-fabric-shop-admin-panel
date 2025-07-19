"use client";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useAddGroupCodeMutation } from "../../../redux/group-code/group-code-api";

export default function AddGroupCode() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [addGroupCode] = useAddGroupCodeMutation();
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (vals: any) => {
    const formData = new FormData();
    formData.append("name", vals.name);
    if (imageRef.current?.files?.[0]) {
      formData.append("image", imageRef.current.files[0]);
    }
    if (videoRef.current?.files?.[0]) {
      formData.append("video", videoRef.current.files[0]);
    }
    await addGroupCode(formData).unwrap();
    reset();
    if (imageRef.current) imageRef.current.value = "";
    if (videoRef.current) videoRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-8 py-8 rounded-md">
      <div className="mb-6">
        <p className="mb-2 text-base text-black">Upload Image</p>
        <input type="file" accept="image/*" ref={imageRef} />
      </div>
      <div className="mb-6">
        <p className="mb-2 text-base text-black">Upload Video</p>
        <input type="file" accept="video/*" ref={videoRef} />
      </div>
      <div className="mb-6">
        <p className="mb-0 text-base text-black">Name</p>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Enter group code name"
        />
        {errors.name && typeof errors.name.message === 'string' && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="tp-btn px-7 py-2"
      >
        {isSubmitting ? "Adding…" : "Add GroupCode"}
      </button>
    </form>
  );
}
