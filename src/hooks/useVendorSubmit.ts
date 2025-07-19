import { useForm } from "react-hook-form";
import { useUpdateVendorMutation } from "@/redux/vendor/vendorApi";

export default function useVendorSubmit() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    reset,
  } = useForm();

  const [updateVendor] = useUpdateVendorMutation();

  const handleEdit = async (data: any, id: string) => {
    await updateVendor({ id, changes: data }).unwrap();
    reset();
  };

  return { register, handleSubmit, errors, isSubmitted, handleEdit };
}
