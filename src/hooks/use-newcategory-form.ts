// src/hooks/useCategoryForm.ts
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { notifySuccess, notifyError } from "@/utils/toast";
import {
  useAddNewCategoryMutation,
  useUpdateNewCategoryMutation,
  useGetNewCategoryQuery,
} from "@/redux/newcategory/newcategoryApi";
import { ICategory } from "@/types/newcategory-type";

interface FormValues {
  name: string;
  productType: string;
  parent: string;
}

export function useCategoryForm(id?: string) {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Queries & mutations
  const { data, isLoading: isFetching } = useGetNewCategoryQuery(id || "", {
    skip: !id,
  });
  const [addCategory] = useAddNewCategoryMutation();
  const [updateCategory] = useUpdateNewCategoryMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  // Prefill on edit
  useEffect(() => {
    if (data?.data) {
      const { name } = data.data;
      setValue("name", name);
      // If you want to prefill image, handle it here
    }
  }, [data, setValue]);

  // Build FormData with all required fields
  const buildFormData = (vals: FormValues) => {
    const fd = new FormData();
    fd.append("name", vals.name);
    fd.append("productType", vals.productType);
    fd.append("parent", vals.parent);
    if (imageFile) fd.append("image", imageFile);
    return fd;
  };

  // Add handler
  const onAdd = async (vals: FormValues) => {
    try {
      const fd = buildFormData(vals);

      await addCategory(fd).unwrap();
      notifySuccess("Category added");
      reset();
      setImageFile(null);
    } catch (err: any) {
      notifyError(err?.data?.error || "Add failed");
    }
  };

  // Edit handler
  const onEdit = async (vals: FormValues) => {
    try {
      const fd = buildFormData(vals);
      await updateCategory({ id: id!, changes: fd }).unwrap();
      notifySuccess("Category updated");
      router.push("/newcategory");
    } catch (err: any) {
      notifyError(err?.data?.error || "Update failed");
    }
  };

  return {
    isFetching,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    imageFile,
    setImageFile,
    onAdd,
    onEdit,
  };
}
