"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ISuitableFor } from "@/types/suitable-for-type";
import { useAddSuitableForMutation } from "@/redux/suitablefor/suitableforApi";
import GlobalImgUpload from "@/app/components/structure/global-img-upload";

export default function AddSuitableFor() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ISuitableFor>({ mode: "onSubmit" });
  const [addSuitableFor] = useAddSuitableForMutation();
  const [img, setImg] = useState<string>("");

  const onSubmit = async (vals: ISuitableFor) => {
    await addSuitableFor({ name: vals.name, img }).unwrap();
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

      <div className="mb-6">
        <p className="mb-0 text-base text-black">Name</p>
        <input
          {...register("name", { required: "Name is required" })}
          className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
          placeholder="Enter suitable-for name"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="tp-btn px-7 py-2"
      >
        {isSubmitting ? "Adding…" : "Add SuitableFor"}
      </button>
    </form>
  );
}
