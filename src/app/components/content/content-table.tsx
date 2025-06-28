// src/app/components/content/content-table.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IContent } from "@/types/content-type";
import {
  useGetAllContentQuery,
  useDeleteContentMutation,
} from "@/redux/content/contentApi";

export default function ContentTable() {
  const { data, isLoading, isError } = useGetAllContentQuery();
  const [deleteContent] = useDeleteContentMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading content</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Content List</h2>
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
                No content found.
              </td>
            </tr>
          ) : (
            data.data.map((c: IContent) => (
              <tr key={c._id}>
                <td className="py-2">
                  {c.img && (
                    <Image
                      src={c.img}
                      alt={c.name}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                      // Optional: use a placeholder blur if you have a blurDataURL
                      // placeholder="blur"
                      // blurDataURL={c.blurDataURL}
                    />
                  )}
                </td>
                <td className="py-2">{c.name}</td>
                <td className="py-2 flex space-x-2">
                  <Link href={`/content/${c._id}`}>
                    <button className="tp-btn px-3 py-1 bg-green-500 text-white rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteContent(c._id!)}
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
