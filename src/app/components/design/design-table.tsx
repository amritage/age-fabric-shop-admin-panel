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
import Swal from "sweetalert2";
import { notifyError } from "@/utils/toast";
import EditTooltip from "../tooltip/edit-tooltip";
import DeleteTooltip from "../tooltip/delete-tooltip";
import { Edit, Delete } from "@/svg";

export default function DesignTable() {
  const { data, isLoading, isError } = useGetAllDesignQuery();
  const [deleteDesign] = useDeleteDesignMutation();
  const [showEdit, setShowEdit] = React.useState<string | null>(null);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this design?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });
    if (result.isConfirmed) {
      try {
        await deleteDesign(id).unwrap();
        Swal.fire("Deleted!", "Your design has been deleted.", "success");
      } catch (err: any) {
        notifyError(
          err?.data?.message ||
            "This filter cannot be deleted because it is already used in your added product."
        );
      }
    }
  };

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
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Link href={`/design/${d._id}`}>
                        <button
                          onMouseEnter={() => setShowEdit(d._id)}
                          onMouseLeave={() => setShowEdit(null)}
                          className="w-8 h-8 flex items-center justify-center bg-success text-white rounded-md hover:bg-green-600"
                        >
                          <Edit />
                        </button>
                      </Link>
                      <EditTooltip showEdit={showEdit === d._id} />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDelete(d._id!)}
                        onMouseEnter={() => setShowDelete(d._id)}
                        onMouseLeave={() => setShowDelete(null)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:text-white"
                      >
                        <Delete />
                      </button>
                      <DeleteTooltip showDelete={showDelete === d._id} />
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
