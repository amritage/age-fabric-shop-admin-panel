import { useForm } from "react-hook-form";
import { useUpdateFinishMutation } from "@/redux/finish/finishApi";

export default function useFinishSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateFinish] = useUpdateFinishMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateFinish({ id, changes: data }).unwrap();
    reset();
  };

  return { register, handleSubmit, errors, isSubmitted, handleEdit };
}
