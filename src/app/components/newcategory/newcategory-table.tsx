// src/app/components/category/CategoryTable.tsx
"use client";

import React from "react";
import { INewCategory } from "@/types/newcategory-type";
import { useGetAllNewCategoriesQuery, useDeleteNewCategoryMutation } from "@/redux/newcategory/newcategoryApi";
import Image from "next/image";
import Swal from "sweetalert2";
import { notifyError } from "@/utils/toast";
import Link from "next/link";
import EditTooltip from "../tooltip/edit-tooltip";
import DeleteTooltip from "../tooltip/delete-tooltip";
import { Edit, Delete } from "@/svg";

interface NewCategoryTableProps {
  onEditClick: (id: string) => void;
}

const NewCategoryTable: React.FC<NewCategoryTableProps> = ({ onEditClick }) => {
  const { data, isLoading, isError } = useGetAllNewCategoriesQuery();
  const [deleteNewCategory] = useDeleteNewCategoryMutation();
  const [showEdit, setShowEdit] = React.useState<string | null>(null);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error loading categories</div>;

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
      } catch (err: any) {
        notifyError(
          err?.data?.message ||
            "This filter cannot be deleted because it is already used in your added product."
        );
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Category List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Image</th>
            <th className="py-2">Name</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!data || !data.data || data.data.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                No categories found.
              </td>
            </tr>
          ) : (
            data.data.map((c: INewCategory) => (
              <tr key={c._id}>
                <td className="py-2">
                  {c.image ? (
                    <Image
                      src={c.image}
                      alt={c.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded text-sm text-gray-400">
                      No Image
                    </div>
                  )}
                </td>
                <td className="py-2">{c.name}</td>
                <td className="py-2 flex space-x-2">
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Link href={`/newcategory/${c._id}`}>
                        <button
                          onMouseEnter={() => setShowEdit(c._id)}
                          onMouseLeave={() => setShowEdit(null)}
                          className="w-8 h-8 flex items-center justify-center bg-success text-white rounded-md hover:bg-green-600"
                        >
                          <Edit />
                        </button>
                      </Link>
                      <EditTooltip showEdit={showEdit === c._id} />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDelete(c._id!)}
                        onMouseEnter={() => setShowDelete(c._id)}
                        onMouseLeave={() => setShowDelete(null)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:text-white"
                      >
                        <Delete />
                      </button>
                      <DeleteTooltip showDelete={showDelete === c._id} />
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NewCategoryTable;
