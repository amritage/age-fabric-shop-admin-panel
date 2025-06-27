"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ISuitableFor } from "@/types/suitable-for-type";
import {
  useGetAllSuitableForQuery,
  useDeleteSuitableForMutation,
} from "@/redux/suitablefor/suitableforApi";

export default function SuitableForTable() {
  const { data, isLoading, isError } = useGetAllSuitableForQuery();
  const [deleteSuitableFor] = useDeleteSuitableForMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading suitable-for</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">SuitableFor List</h2>
      <table className="w-full text-left">
        <thead>
          <tr><th className="py-2">Image</th><th className="py-2">Name</th><th className="py-2">Actions</th></tr>
        </thead>
        <tbody>
          {!data || !data.data || data.data.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                No items found.
              </td>
            </tr>
          ) : (
            data.data.map((s: ISuitableFor) => (
              <tr key={s._id}>
                <td className="py-2">
                  {s.img && <Image src={s.img} alt={s.name} width={48} height={48} className="w-12 h-12 object-cover rounded" />}
                </td>
                <td className="py-2">{s.name}</td>
                <td className="py-2 flex space-x-2">
                  <Link href={`/suitable-for/${s._id}`}>
                    <button className="tp-btn px-3 py-1 bg-green-500 text-white rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button onClick={() => deleteSuitableFor(s._id!)} className="tp-btn px-3 py-1 bg-red-500 text-white rounded">
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
