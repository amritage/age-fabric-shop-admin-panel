// src/app/components/category/CategoryTable.tsx
"use client";

import React from "react";
import Link from "next/link";
import { ICategory } from "@/types/newcategory-type";
import Image from "next/image";
import {
  useGetAllCategoryQuery,
  useDeleteCategoryMutation,
} from "@/redux/newcategory/newcategoryApi";

export default function CategoryTable() {
  const { data, isLoading, isError } = useGetAllCategoryQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error loading categories</div>;

  // Base URL of your API server, must match what you use in express
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!BASE) {
    throw new Error("API base URL is not set. Please configure NEXT_PUBLIC_API_BASE_URL in your environment.");
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Category List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Image</th>
            <th className="py-2">Name</th>
            <th className="py-2">Product Type</th>
            <th className="py-2">Parent</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!data || !data.data || data.data.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-500 py-4">
                No categories found.
              </td>
            </tr>
          ) : (
            data.data.map((c: ICategory) => (
              <tr key={c._id}>
                <td className="py-2">
                  {c.image ? (
                    <Image
                      src={`${BASE}/uploads/${c.image}`}
                      alt={c.name}
                      width={48}
                      height={48}
                      unoptimized
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded text-sm text-gray-400">
                      No Image
                    </div>
                  )}
                </td>
                <td className="py-2">{c.name}</td>
                <td className="py-2">{c.productType}</td>
                <td className="py-2">{c.parent}</td>
                <td className="py-2 flex space-x-2">
                  <Link href={`/newcategory/${c._id}`}>
                    <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteCategory(c._id!)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
}
