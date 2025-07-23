"use client";
import React from "react";
import { ISubSuitableFor } from "@/types/subsuitable-type";
import {
  useGetAllSubSuitableForQuery,
  useDeleteSubSuitableForMutation,
} from "@/redux/subsuitablefor/subsuitableApi";
import Swal from "sweetalert2";
import { notifyError } from "@/utils/toast";
import EditTooltip from "../tooltip/edit-tooltip";
import DeleteTooltip from "../tooltip/delete-tooltip";
import { Edit, Delete } from "@/svg";
import Link from "next/link";

export default function SubSuitableForTable() {
  const { data, isLoading, isError } = useGetAllSubSuitableForQuery(undefined, {
    pollingInterval: 5000,
  });
  const [deleteSSF] = useDeleteSubSuitableForMutation();
  const [showEdit, setShowEdit] = React.useState<string | null>(null);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this sub-suitable for?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });
    if (result.isConfirmed) {
      try {
        await deleteSSF(id).unwrap();
        Swal.fire(
          "Deleted!",
          "Your sub-suitable for has been deleted.",
          "success"
        );
      } catch (err: any) {
        notifyError(
          err?.data?.message ||
            "This filter cannot be deleted because it is already used in your added product."
        );
      }
    }
  };

  const getParentName = (
    val: string | { name: string | { en?: string; hi?: string } }
  ) => {
    if (typeof val === "string") return val;
    const name = val.name;
    if (typeof name === "string") return name;
    return name?.en || name?.hi || "—";
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading items</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Sub-SuitableFor List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Parent</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!data || data.data.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                No items found.
              </td>
            </tr>
          ) : (
            data.data.map((ssf: ISubSuitableFor) => (
              <tr key={ssf._id}>
                {/* ✅ Name column */}
                <td className="py-2">{ssf.name}</td>

                {/* ✅ Parent column */}
                <td className="py-2">{getParentName(ssf.suitableforId)}</td>

                {/* ✅ Actions column */}
                <td className="py-2">
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Link href={`/subsuitablefor/${ssf._id}`}>
                        <button
                          onMouseEnter={() => setShowEdit(ssf._id)}
                          onMouseLeave={() => setShowEdit(null)}
                          className="w-8 h-8 flex items-center justify-center bg-success text-white rounded-md hover:bg-green-600"
                        >
                          <Edit />
                        </button>
                      </Link>
                      <EditTooltip showEdit={showEdit === ssf._id} />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDelete(ssf._id!)}
                        onMouseEnter={() => setShowDelete(ssf._id)}
                        onMouseLeave={() => setShowDelete(null)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:text-white"
                      >
                        <Delete />
                      </button>
                      <DeleteTooltip showDelete={showDelete === ssf._id} />
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
