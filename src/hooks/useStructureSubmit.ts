// src/hooks/useStructureSubmit.ts
import { useForm } from "react-hook-form";
import { useUpdateStructureMutation } from "@/redux/structure/structureApi";

export default function useStructureSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateStructure] = useUpdateStructureMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateStructure({ id, changes: data }).unwrap();
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
