// src/app/components/category/CategoryEditDelete.tsx
"use client";
import { Edit, Delete } from "@/svg";
import React, { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import EditTooltip from "../tooltip/edit-tooltip";
import DeleteTooltip from "../tooltip/delete-tooltip";
import { useDeleteCategoryMutation } from "@/redux/newcategory/newcategoryApi";
import { notifyError } from "@/utils/toast";
import { useRouter } from "next/navigation";

export default function CategoryEditDelete({ id }: { id: string }) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCategory] = useDeleteCategoryMutation();
  const router = useRouter();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this category?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      try {
        await deleteCategory(id).unwrap();
        Swal.fire("Deleted!", "Category has been deleted.", "success");
        router.push("/categories");
      } catch (err: any) {
        notifyError(err?.data?.error || "Failed to delete category.");
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <div className="relative">
        <Link href={`/categories/${id}`}>
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
          onClick={handleDelete}
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
}
