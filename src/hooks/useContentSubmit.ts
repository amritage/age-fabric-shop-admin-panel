// src/hooks/useContentSubmit.ts
import { useForm } from "react-hook-form";
import { useUpdateContentMutation } from "@/redux/content/contentApi";

export default function useContentSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateContent] = useUpdateContentMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateContent({ id, changes: data }).unwrap();
    reset();
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitted,
    handleEdit,
  };
}
