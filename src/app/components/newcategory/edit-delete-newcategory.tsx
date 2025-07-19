// src/app/components/category/CategoryEditDelete.tsx
"use client";
import { Delete, Edit } from "@/svg";
import React, { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import EditTooltip from "../tooltip/edit-tooltip";
import DeleteTooltip from "../tooltip/delete-tooltip";
import { useDeleteNewCategoryMutation } from "@/redux/newcategory/newcategoryApi";
import { notifyError } from "@/utils/toast";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

const NewCategoryEditDelete: React.FC<Props> = ({ id }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const [deleteNewCategory] = useDeleteNewCategoryMutation();

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this category?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      try {
        await deleteNewCategory(id).unwrap();
        Swal.fire("Deleted!", "Your category has been deleted.", "success");
        router.push("/newcategory");
      } catch (err: any) {
        notifyError(
          err?.data?.message ||
            "This filter cannot be deleted because it is already used in your added product."
        );
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <div className="relative">
        <Link href={`/newcategory/${id}`}>
          <button
            onMouseEnter={() => setShowEdit(true)}
            onMouseLeave={() => setShowEdit(false)}
            className="w-8 h-8 flex items-center justify-center bg-success text-white rounded-md hover:bg-green-600"
          >
            <Edit />
          </button>
        </Link>
        <EditTooltip showEdit={showEdit} />
      </div>
      <div className="relative">
        <button
          onClick={() => handleDelete(id)}
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
          className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:border-danger hover:text-white"
        >
          <Delete />
        </button>
        <DeleteTooltip showDelete={showDelete} />
      </div>
    </div>
  );
};

export default NewCategoryEditDelete;
