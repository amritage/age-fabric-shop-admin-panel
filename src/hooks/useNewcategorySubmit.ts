// src/hooks/useNewcategorySubmit.ts
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { notifySuccess, notifyError } from "@/utils/toast";
import {
  useAddNewCategoryMutation,
  useUpdateNewCategoryMutation,
} from "@/redux/newcategory/newcategoryApi";

interface FormValues {
  name: string;
}

export default function useNewcategorySubmit() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [addCategory] = useAddNewCategoryMutation();
  const [updateCategory] = useUpdateNewCategoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm<FormValues>();

  /** Add handler */
  const onAdd = async (vals: FormValues) => {
    const fd = new FormData();
    fd.append("name", vals.name);
    if (imageFile) fd.append("image", imageFile);

    try {
      await addCategory(fd).unwrap();
      notifySuccess("Category added");
      reset();
      setImageFile(null);
    } catch (err: any) {
      notifyError(err?.data?.error || "Add failed");
    }
  };

  /** Edit handler */
  const onEdit = async (vals: FormValues, id: string) => {
    const fd = new FormData();
    fd.append("name", vals.name);
    if (imageFile) fd.append("image", imageFile);

    try {
      await updateCategory({ id, changes: fd }).unwrap();
      notifySuccess("Category updated");
      router.push("/categories");
    } catch (err: any) {
      notifyError(err?.data?.error || "Update failed");
    }
  };

  const handleEdit = async (data: any, id: string) => {
    await updateCategory({ id, changes: data }).unwrap();
    reset();
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitted,
    reset,
    imageFile,
    setImageFile,
    onAdd,
    onEdit,
    handleEdit,
  };
}
