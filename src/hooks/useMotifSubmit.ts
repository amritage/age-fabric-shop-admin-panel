import { useForm } from "react-hook-form";
import { useUpdateMotifMutation } from "@/redux/motif/motifApi";

export default function useMotifSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateMotif] = useUpdateMotifMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateMotif({ id, changes: data }).unwrap();
    reset();
  };

  return { register, handleSubmit, errors, isSubmitted, handleEdit };
}
