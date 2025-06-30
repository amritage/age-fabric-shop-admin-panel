// src/app/components/category/CategoryTable.tsx
"use client";

import React from "react";
import { INewCategory } from "@/types/newcategory-type";
import { useGetAllNewCategoriesQuery, useDeleteNewCategoryMutation } from "@/redux/newcategory/newcategoryApi";
import Image from "next/image";

interface NewCategoryTableProps {
  onEditClick: (id: string) => void;
}

const NewCategoryTable: React.FC<NewCategoryTableProps> = ({ onEditClick }) => {
  const { data, isLoading, isError } = useGetAllNewCategoriesQuery();
  const [deleteNewCategory] = useDeleteNewCategoryMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error loading categories</div>;

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
                  <button
                    onClick={() => onEditClick(c._id)}
                    className="tp-btn px-3 py-1 bg-green-500 text-white rounded"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteNewCategory(c._id!)}
                    className="tp-btn px-3 py-1 bg-red-500 text-white rounded"
                  >
                    🗑️ Delete
                  </button>
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
