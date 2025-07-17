"use client";
import { Delete, Edit } from "@/svg";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import DeleteTooltip from "../tooltip/delete-tooltip";
import EditTooltip from "../tooltip/edit-tooltip";
import { useDeleteSuitableForMutation } from "@/redux/suitablefor/suitableforApi";
import { notifyError } from "@/utils/toast";
import { useRouter } from "next/navigation";

type Props = { id: string };

export default function SuitableForEditDelete({ id }: Props) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const [deleteSuitableFor] = useDeleteSuitableForMutation();

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
        Swal.fire("Deleted!", "", "success");
        router.push("/suitable-for");
      } catch (err: any) {
        notifyError(err?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <div className="relative">
        <Link href={`/suitable-for/${id}`}>
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
          onClick={() => handleDelete(id)}
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
