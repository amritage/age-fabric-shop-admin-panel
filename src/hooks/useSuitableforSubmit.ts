import { useForm } from "react-hook-form";
import { useUpdateSuitableForMutation } from "@/redux/suitablefor/suitableforApi";

export default function useSuitableforSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateSuitableFor] = useUpdateSuitableForMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateSuitableFor({ id, changes: data }).unwrap();
    reset();
  };

  return { register, handleSubmit, errors, isSubmitted, handleEdit };
}
