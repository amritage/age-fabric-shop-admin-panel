// File: app/components/motif/MotifTable.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IMotif } from "@/types/motif-type";
import {
  useGetAllMotifQuery,
  useDeleteMotifMutation,
} from "@/redux/motif/motifApi";

export default function MotifTable() {
  const { data, isLoading, isError } = useGetAllMotifQuery();
  const [deleteMotif] = useDeleteMotifMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading motifs</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Motif List</h2>
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
                No motifs found.
              </td>
            </tr>
          ) : (
            data.data.map((m: IMotif) => (
              <tr key={m._id}>
                <td className="py-2">
                  {m.img && (
                    <Image
                      src={m.img}
                      alt={m.name}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                      // placeholder="blur"
                      // blurDataURL={m.blurDataURL}
                    />
                  )}
                </td>
                <td className="py-2">{m.name}</td>
                <td className="py-2 flex space-x-2">
                  <Link href={`/motif/${m._id}`}>
                    <button className="tp-btn px-3 py-1 bg-green-500 text-white rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteMotif(m._id!)}
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
