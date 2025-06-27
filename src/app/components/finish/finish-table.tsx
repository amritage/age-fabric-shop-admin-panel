// File: app/components/finish/FinishTable.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IFinish } from "@/types/finish-type";
import {
  useGetAllFinishQuery,
  useDeleteFinishMutation,
} from "@/redux/finish/finishApi";

export default function FinishTable() {
  const { data, isLoading, isError } = useGetAllFinishQuery();
  const [deleteFinish] = useDeleteFinishMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error loading finish items</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Finish List</h2>
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
                No finish items found.
              </td>
            </tr>
          ) : (
            data.data.map((f: IFinish) => (
              <tr key={f._id}>
                <td className="py-2">
                  {f.img && (
                    <Image
                      src={f.img}
                      alt={f.name}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                      // optional placeholder blur:
                      // placeholder="blur"
                      // blurDataURL={f.blurDataURL}
                    />
                  )}
                </td>
                <td className="py-2">{f.name}</td>
                <td className="py-2 flex space-x-2">
                  <Link href={`/finish/${f._id}`}>
                    <button className="tp-btn px-3 py-1 bg-green-500 text-white rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteFinish(f._id!)}
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
