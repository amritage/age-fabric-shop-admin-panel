// File: app/components/group-code/GroupCodeTable.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IGroupCode } from "@/types/group-code-type";
import {
  useGetAllGroupCodesQuery,
  useDeleteGroupCodeMutation,
} from "@/redux/group-code/group-code-api";

export default function GroupCodeTable() {
  const { data, isLoading, isError } = useGetAllGroupCodesQuery();
  const [deleteGroupCode] = useDeleteGroupCodeMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading group codes</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Group Code List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Image</th>
            <th className="py-2">Name</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                No items found.
              </td>
            </tr>
          ) : (
            data?.data?.map((u: IGroupCode) => (
              <tr key={u._id}>
                <td className="py-2">
                  {u.img && (
                    <Image
                      src={u.img}
                      alt={u.name}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                      // placeholder="blur"
                      // blurDataURL={u.blurDataURL}
                    />
                  )}
                </td>
                <td className="py-2">{u.name}</td>
                <td className="py-2 flex space-x-2">
                  <Link href={`/group-code/${u._id}`}>
                    <button className="tp-btn px-3 py-1 bg-green-500 text-white rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteGroupCode(u._id!)}
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
