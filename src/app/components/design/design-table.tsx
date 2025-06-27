// src/app/components/design/DesignTable.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IDesign } from "@/types/design-type";
import {
  useGetAllDesignQuery,
  useDeleteDesignMutation,
} from "@/redux/design/designApi";

export default function DesignTable() {
  const { data, isLoading, isError } = useGetAllDesignQuery();
  const [deleteDesign] = useDeleteDesignMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading designs</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Design List</h2>
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
                No designs found.
              </td>
            </tr>
          ) : (
            data.data.map((d: IDesign) => (
              <tr key={d._id}>
                <td className="py-2">
                  {d.img && (
                    <Image
                      src={d.img}
                      alt={d.name}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                      // Optional blur placeholder:
                      // placeholder="blur"
                      // blurDataURL={d.blurDataURL}
                    />
                  )}
                </td>
                <td className="py-2">{d.name}</td>
                <td className="py-2 flex space-x-2">
                  <Link href={`/design/${d._id}`}>
                    <button className="tp-btn px-3 py-1 bg-green-500 text-white rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteDesign(d._id!)}
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
