"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ISuitableFor } from "@/types/suitable-for-type";
import {
  useGetAllSuitableForQuery,
  useDeleteSuitableForMutation,
} from "@/redux/suitablefor/suitableforApi";
import Swal from "sweetalert2";
import { notifyError } from "@/utils/toast";
import EditTooltip from "../tooltip/edit-tooltip";
import DeleteTooltip from "../tooltip/delete-tooltip";
import { Edit, Delete } from "@/svg";

export default function SuitableForTable() {
  const { data, isLoading, isError } = useGetAllSuitableForQuery();
  const [deleteSuitableFor] = useDeleteSuitableForMutation();
  const [showEdit, setShowEdit] = React.useState<string | null>(null);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this suitable for?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });
    if (result.isConfirmed) {
      try {
        await deleteSuitableFor(id).unwrap();
        Swal.fire("Deleted!", "Your suitable for has been deleted.", "success");
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
    return <div className="text-red-500">Error loading suitable-for</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">SuitableFor List</h2>
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
            data.data.map((s: ISuitableFor) => (
              <tr key={s._id}>
                <td className="py-2">
                  {s.img && (
                    <Image
                      src={s.img}
                      alt={s.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-2">{s.name}</td>
                <td className="py-2 flex space-x-2">
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Link href={`/suitable-for/${s._id}`}>
                        <button
                          onMouseEnter={() => setShowEdit(s._id)}
                          onMouseLeave={() => setShowEdit(null)}
                          className="w-8 h-8 flex items-center justify-center bg-success text-white rounded-md hover:bg-green-600"
                        >
                          <Edit />
                        </button>
                      </Link>
                      <EditTooltip showEdit={showEdit === s._id} />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDelete(s._id!)}
                        onMouseEnter={() => setShowDelete(s._id)}
                        onMouseLeave={() => setShowDelete(null)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:text-white"
                      >
                        <Delete />
                      </button>
                      <DeleteTooltip showDelete={showDelete === s._id} />
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
