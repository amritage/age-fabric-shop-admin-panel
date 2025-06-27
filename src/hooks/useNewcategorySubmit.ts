// src/hooks/useNewCategorySubmit.ts
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { notifySuccess, notifyError } from "@/utils/toast";
import {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/newcategory/newcategoryApi";

interface FormValues {
  name: string;
}

export default function useNewCategorySubmit() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
      await updateCategory({ id, formData: fd }).unwrap();
      notifySuccess("Category updated");
      router.push("/categories");
    } catch (err: any) {
      notifyError(err?.data?.error || "Update failed");
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    reset,
    imageFile,
    setImageFile,
    onAdd,
    onEdit,
  };
}
