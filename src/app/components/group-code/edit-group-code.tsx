"use client";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useGetGroupCodeQuery,
  useUpdateGroupCodeMutation,
} from "../../../redux/group-code/group-code-api";
import ErrorMsg from "@/app/components/common/error-msg";
import { IGroupCode } from "@/types/group-code-type";
import Image from "next/image";
import { notifySuccess } from "@/utils/toast";

interface EditGroupCodeProps {
  id: string;
}

export default function EditGroupCode({ id }: EditGroupCodeProps) {
  const router = useRouter();

  // 1) Fetch single group-code
  const {
    data,
    isLoading: isFetching,
    isError: fetchError,
  } = useGetGroupCodeQuery(id || "");

  // 2) Prepare update
  const [updateGroupCode, { isLoading: isUpdating }] =
    useUpdateGroupCodeMutation();

  // 3) Setup form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IGroupCode>({ mode: "onSubmit" });
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [newImgFile, setNewImgFile] = useState<File | null>(null);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // 4) Prefill on data arrival
  useEffect(() => {
    if (data?.data) {
      setValue("name", data.data.name);
      setImg(data.data.image || "");
      setVideo(data.data.video || "");
    }
  }, [data, setValue]);

  // Handle image file change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImgFile(file);
      setImg(URL.createObjectURL(file)); // Preview new image
    }
  };

  // Handle video file change
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewVideoFile(file);
      setVideo(URL.createObjectURL(file)); // Preview new video
    }
  };

  // 5) Submit handler
  const onSubmit = async (vals: IGroupCode) => {
    try {
      const formData = new FormData();
      formData.append("name", vals.name);
      if (newImgFile) formData.append("image", newImgFile);
      if (newVideoFile) formData.append("video", newVideoFile);
      await updateGroupCode({ id: id!, changes: formData }).unwrap();
      notifySuccess("Group Code updated successfully!");
      router.push("/group-code");
    } catch {
      // handle error if you want
    }
  };

  if (isFetching) return <p>Loading…</p>;
  if (fetchError || !data) return <ErrorMsg msg="Failed to load group-code." />;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white px-8 py-8 rounded-md space-y-6"
    >
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Current Image
        </label>
        {img && (
          <Image src={img} alt="Current" width={100} height={91} className="mb-2 object-cover rounded" />
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Current Video
        </label>
        {video && (
          <video width={160} height={90} controls src={video} className="mb-2" />
        )}
        <input type="file" accept="video/*" onChange={handleVideoChange} />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          className="w-full px-3 py-2 border rounded-md focus:outline-none"
          placeholder="Enter group code name"
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
