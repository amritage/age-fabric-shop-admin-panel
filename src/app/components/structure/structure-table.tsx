"use client";

// src/app/components/structure/structure-table.tsx
"use client";

import React, { useState } from "react";
import { IStructureItem } from "@/types/structure-type";
import {
  useGetAllStructuresQuery,
  useDeleteStructureMutation,
} from "@/redux/structure/structureApi";
import Swal from "sweetalert2";
import { notifyError } from "@/utils/toast";
import Link from "next/link";
import EditTooltip from "../tooltip/edit-tooltip";
import DeleteTooltip from "../tooltip/delete-tooltip";
import { Edit, Delete } from "@/svg";

interface StructureTableProps {
  onEditClick: (id: string) => void;
}

const StructureTable: React.FC<StructureTableProps> = ({ onEditClick }) => {
  const { data, isLoading, isError } = useGetAllStructuresQuery();
  const [deleteStructure] = useDeleteStructureMutation();
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error loading structures</div>;

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this structure?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });
    if (result.isConfirmed) {
      try {
        await deleteStructure(id).unwrap();
        Swal.fire("Deleted!", "Your structure has been deleted.", "success");
      } catch (err: any) {
        notifyError(
          err?.data?.message ||
            "This filter cannot be deleted because it is already used in your added product."
        );
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Structure List</h2>
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
                No structures found.
              </td>
            </tr>
          ) : (
            data.data.map((item: IStructureItem) => (
              <tr key={item._id}>
                <td className="py-2">
                  {item.img && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-2">{item.name}</td>
                <td className="py-2 flex space-x-2">
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Link href={`/structure/${item._id}`}>
                        <button
                          onMouseEnter={() => setShowEdit(item._id)}
                          onMouseLeave={() => setShowEdit(null)}
                          className="w-8 h-8 flex items-center justify-center bg-success text-white rounded-md hover:bg-green-600"
                        >
                          <Edit />
                        </button>
                        <EditTooltip showEdit={showEdit === item._id} />
                      </Link>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDelete(item._id!)}
                        onMouseEnter={() => setShowDelete(item._id)}
                        onMouseLeave={() => setShowDelete(null)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:text-white"
                      >
                        <Delete />
                      </button>
                      <DeleteTooltip showDelete={showDelete === item._id} />
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
};

export default StructureTable;
