// src/app/components/uniquecode/unique-code-table.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IUniqueCode } from "@/types/uniquecode-type";
import {
  useGetAllUniqueCodesQuery,
  useDeleteUniqueCodeMutation,
} from "@/redux/uniquecode/uniquecodeApi";

export default function UniqueCodeTable() {
  // 🔑 Note the plural hook name here:
  const { data, isLoading, isError } = useGetAllUniqueCodesQuery();
  const [deleteUniqueCode] = useDeleteUniqueCodeMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error loading unique codes</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Unique Code List</h2>
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
                No items found.
              </td>
            </tr>
          ) : (
            data?.data?.map((u: IUniqueCode) => (
              <tr key={u._id}>
                <td className="py-2">
                  {u.img && (
                    <Image
                      src={u.img}
                      alt={u.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-2">{u.name}</td>
                <td className="py-2 flex space-x-2">
                  <Link href={`/unique-code/${u._id}`}>
                    <button className="tp-btn px-3 py-1 bg-green-500 text-white rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteUniqueCode(u._id!)}
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
}
