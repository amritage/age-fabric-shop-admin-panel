import { useForm } from "react-hook-form";
import { useUpdateUniqueCodeMutation } from "@/redux/uniquecode/uniquecodeApi";

export default function useUniqueCodeSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateUniqueCode] = useUpdateUniqueCodeMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateUniqueCode({ id, changes: data }).unwrap();
    reset();
  };

  return { register, handleSubmit, errors, isSubmitted, handleEdit };
}
