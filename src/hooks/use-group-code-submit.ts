import { useForm } from "react-hook-form";
import { useUpdateGroupCodeMutation } from "@/redux/group-code/group-code-api";
import { toast } from "react-toastify";

export default function useGroupCodeSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [updateGroupCode] = useUpdateGroupCodeMutation();

  const handleEdit = async (data: { name: string }, id: string) => {
    try {
      await updateGroupCode({ id, changes: data }).unwrap();
      toast.success("Group Code updated successfully");
      reset();
    } catch (err) {
      toast.error("Failed to update Group Code");
    }
  };

  return { register, handleSubmit, errors, handleEdit };
}
