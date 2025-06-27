// src/app/components/color/ColorTable.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IColor } from "@/types/color-type";
import {
  useGetAllColorQuery,
  useDeleteColorMutation,
} from "@/redux/color/colorApi";

export default function ColorTable() {
  const { data, isLoading, isError } = useGetAllColorQuery();
  const [deleteColor] = useDeleteColorMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading colors</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Color List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Image</th>
            <th className="py-2">Name</th>
            <th className="py-2">CSS</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!data || !data.data || data.data.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-4">
                No colors found.
              </td>
            </tr>
          ) : (
            data.data.map((c: IColor) => (
              <tr key={c._id}>
                <td className="py-2">
                  {c.img && (
                    <Image
                      src={c.img}
                      alt={c.name}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                      // You can enable blur placeholder if you have a blurDataURL:
                      // placeholder="blur"
                      // blurDataURL={c.blurDataURL}
                    />
                  )}
                </td>
                <td className="py-2">{c.name}</td>
                <td className="py-2">
                  <span
                    className="inline-block w-6 h-6 rounded"
                    style={{ backgroundColor: c.css }}
                  />
                  <span className="ml-2">{c.css}</span>
                </td>
                <td className="py-2 flex space-x-2">
                  <Link href={`/colors/${c._id}`}>
                    <button className="tp-btn px-3 py-1 bg-green-500 text-white rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteColor(c._id!)}
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
