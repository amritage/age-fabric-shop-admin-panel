import { useForm } from "react-hook-form";
import { useUpdateSubstructureMutation } from "@/redux/substructure/substructureApi";

export default function useSubstructureSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateSubstructure] = useUpdateSubstructureMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateSubstructure({ id, changes: data }).unwrap();
    reset();
  };

  return { register, handleSubmit, errors, isSubmitted, handleEdit };
}
