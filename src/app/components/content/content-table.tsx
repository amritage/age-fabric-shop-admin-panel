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
import Swal from "sweetalert2";
import { notifyError } from "@/utils/toast";
import EditTooltip from "../tooltip/edit-tooltip";
import DeleteTooltip from "../tooltip/delete-tooltip";
import { Edit, Delete } from "@/svg";

export default function ContentTable() {
  const { data, isLoading, isError } = useGetAllContentQuery();
  const [deleteContent] = useDeleteContentMutation();
  const [showEdit, setShowEdit] = React.useState<string | null>(null);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this content?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });
    if (result.isConfirmed) {
      try {
        await deleteContent(id).unwrap();
        Swal.fire("Deleted!", "Your content has been deleted.", "success");
      } catch (err: any) {
        notifyError(
          err?.data?.message ||
            "This filter cannot be deleted because it is already used in your added product."
        );
      }
    }
  };

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
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Link href={`/content/${c._id}`}>
                        <button
                          onMouseEnter={() => setShowEdit(c._id)}
                          onMouseLeave={() => setShowEdit(null)}
                          className="w-8 h-8 flex items-center justify-center bg-success text-white rounded-md hover:bg-green-600"
                        >
                          <Edit />
                        </button>
                      </Link>
                      <EditTooltip showEdit={showEdit === c._id} />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDelete(c._id!)}
                        onMouseEnter={() => setShowDelete(c._id)}
                        onMouseLeave={() => setShowDelete(null)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:text-white"
                      >
                        <Delete />
                      </button>
                      <DeleteTooltip showDelete={showDelete === c._id} />
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
