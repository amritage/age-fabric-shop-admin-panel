import { useForm } from "react-hook-form";
import { useUpdateSubSuitableForMutation } from "@/redux/subsuitablefor/subsuitableApi";

export default function useSubSuitableForSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateSSF] = useUpdateSubSuitableForMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateSSF({ id, changes: data }).unwrap();
    reset();
  };

  return { register, handleSubmit, errors, isSubmitted, handleEdit };
}
