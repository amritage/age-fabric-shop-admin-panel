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
import Swal from "sweetalert2";
import { notifyError } from "@/utils/toast";
import EditTooltip from "../tooltip/edit-tooltip";
import DeleteTooltip from "../tooltip/delete-tooltip";
import { Edit, Delete } from "@/svg";

export default function FinishTable() {
  const { data, isLoading, isError } = useGetAllFinishQuery();
  const [deleteFinish] = useDeleteFinishMutation();
  const [showEdit, setShowEdit] = React.useState<string | null>(null);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this finish item?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });
    if (result.isConfirmed) {
      try {
        await deleteFinish(id).unwrap();
        Swal.fire("Deleted!", "Your finish item has been deleted.", "success");
      } catch (err: any) {
        notifyError(
          err?.data?.message ||
            "This filter cannot be deleted because it is already used in your added product."
        );
      }
    }
  };

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
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Link href={`/finish/${f._id}`}>
                        <button
                          onMouseEnter={() => setShowEdit(f._id)}
                          onMouseLeave={() => setShowEdit(null)}
                          className="w-8 h-8 flex items-center justify-center bg-success text-white rounded-md hover:bg-green-600"
                        >
                          <Edit />
                        </button>
                      </Link>
                      <EditTooltip showEdit={showEdit === f._id} />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDelete(f._id!)}
                        onMouseEnter={() => setShowDelete(f._id)}
                        onMouseLeave={() => setShowDelete(null)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:text-white"
                      >
                        <Delete />
                      </button>
                      <DeleteTooltip showDelete={showDelete === f._id} />
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
