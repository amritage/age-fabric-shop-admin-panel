import { useForm } from "react-hook-form";
import { useUpdateSubFinishMutation } from "@/redux/subfinish/subfinishApi";

export default function useSubFinishSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateSubFinish] = useUpdateSubFinishMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateSubFinish({ id, changes: data }).unwrap();
    reset();
  };

  return { register, handleSubmit, errors, isSubmitted, handleEdit };
}
