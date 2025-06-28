"use client";
// src/app/components/color/AddColor.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IColor } from "@/types/color-type";
import { useAddColorMutation } from "@/redux/color/colorApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";

export default function AddColor() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IColor>();
  const [addColor] = useAddColorMutation();
  const [img, setImg] = useState<string>("");

  const onSubmit = async (vals: IColor) => {
    await addColor({ name: vals.name, css: vals.css, img }).unwrap();
    reset();
    setImg("");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md"
    >
      <GlobalImgUpload
        image={img}
        setImage={setImg}
        isSubmitted={isSubmitting}
      />

      {/* Name */}
      <div className="mb-6">
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

      {/* CSS */}
      <div className="mb-6">
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="tp-btn px-7 py-2"
      >
        {isSubmitting ? "Adding…" : "Add Color"}
      </button>
    </form>
  );
}
