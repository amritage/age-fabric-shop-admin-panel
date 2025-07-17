import { useForm } from "react-hook-form";
import { useUpdateDesignMutation } from "@/redux/design/designApi";

export default function useDesignSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateDesign] = useUpdateDesignMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateDesign({ id, changes: data }).unwrap();
    reset();
  };

  return { register, handleSubmit, errors, isSubmitted, handleEdit };
}
