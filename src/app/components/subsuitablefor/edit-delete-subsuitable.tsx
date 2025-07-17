"use client";
import { Delete, Edit } from "@/svg";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import DeleteTooltip from "../tooltip/delete-tooltip";
import EditTooltip from "../tooltip/edit-tooltip";
import { useDeleteSubSuitableForMutation } from "@/redux/subsuitablefor/subsuitableApi";
import { notifyError } from "@/utils/toast";

type Props = { id: string; onDelete: () => void };

export default function SubSuitableForEditDelete({ id, onDelete }: Props) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteSSF] = useDeleteSubSuitableForMutation();

  const handleDelete = async () => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this sub suitable for?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });
    if (res.isConfirmed) {
      try {
        await deleteSSF(id).unwrap();
        Swal.fire("Deleted!", "", "success");
        onDelete();
      } catch (err: any) {
        notifyError(err?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <div className="relative">
        <Link href={`/subsuitablefor/${id}`}>
          <button
            onMouseEnter={() => setShowEdit(true)}
            onMouseLeave={() => setShowEdit(false)}
            className="w-8 h-8 flex items-center justify-center bg-success text-white rounded-md hover:bg-green-600"
          >
            <Edit />
          </button>
        </Link>
        <EditTooltip showEdit={showEdit} />
      </div>
      <div className="relative">
        <button
          onClick={handleDelete}
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
          className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:text-white"
        >
          <Delete />
        </button>
        <DeleteTooltip showDelete={showDelete} />
      </div>
    </div>
  );
}
