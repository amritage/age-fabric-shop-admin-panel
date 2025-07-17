"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IGroupCode } from "@/types/group-code-type";
import {
  useGetAllGroupCodesQuery,
  useDeleteGroupCodeMutation,
} from "@/redux/group-code/group-code-api";
import Swal from "sweetalert2";
import { notifyError } from "@/utils/toast";
import EditTooltip from "../tooltip/edit-tooltip";
import DeleteTooltip from "../tooltip/delete-tooltip";
import { Edit, Delete } from "@/svg";

export default function GroupCodeTable() {
  const { data, isLoading, isError } = useGetAllGroupCodesQuery();
  const [deleteGroupCode] = useDeleteGroupCodeMutation();
  const [showEdit, setShowEdit] = React.useState<string | null>(null);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this group code?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });
    if (result.isConfirmed) {
      try {
        await deleteGroupCode(id).unwrap();
        Swal.fire("Deleted!", "Your group code has been deleted.", "success");
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
    return <div className="text-red-500">Error loading group codes</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Group Code List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Image</th>
            <th className="py-2">Video</th>
            <th className="py-2">Name</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-gray-500 py-4">
                No items found.
              </td>
            </tr>
          ) : (
            data?.data?.map((u: IGroupCode) => (
              <tr key={u._id}>
                <td className="py-2">
                  {u.img && (
                    <Image
                      src={u.img}
                      alt={u.name}
                      width={60}
                      height={60}
                      className="object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-2">
                  {u.video && (
                    <video width={64} height={48} controls>
                      <source src={u.video} />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </td>
                <td className="py-2">{u.name}</td>
                <td className="py-2 flex space-x-2">
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Link href={`/group-code/${u._id}`}>
                        <button
                          onMouseEnter={() => setShowEdit(u._id)}
                          onMouseLeave={() => setShowEdit(null)}
                          className="w-8 h-8 flex items-center justify-center bg-success text-white rounded-md hover:bg-green-600"
                        >
                          <Edit />
                        </button>
                      </Link>
                      <EditTooltip showEdit={showEdit === u._id} />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => handleDelete(u._id!)}
                        onMouseEnter={() => setShowDelete(u._id)}
                        onMouseLeave={() => setShowDelete(null)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:text-white"
                      >
                        <Delete />
                      </button>
                      <DeleteTooltip showDelete={showDelete === u._id} />
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
