// src/app/components/motif/MotifEditDelete.tsx
"use client";

import { Delete, Edit } from "@/svg";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import DeleteTooltip from "../tooltip/delete-tooltip";
import EditTooltip from "../tooltip/edit-tooltip";
import { useDeleteMotifMutation } from "@/redux/motif/motifApi";
import { notifyError } from "@/utils/toast";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

const MotifEditDelete: React.FC<Props> = ({ id }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const [deleteMotif] = useDeleteMotifMutation();

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete this motif?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      try {
        await deleteMotif(id).unwrap();
        Swal.fire("Deleted!", "Your motif has been deleted.", "success");
        router.push("/motif");
      } catch (err: any) {
        if (err?.data?.message) {
          notifyError(err.data.message);
        } else {
          notifyError("Failed to delete motif.");
        }
      }
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Edit button */}
      <div className="relative">
        <Link href={`/motif/${id}`}>
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

      {/* Delete button */}
      <div className="relative">
        <button
          onClick={() => handleDelete(id)}
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
          className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:border-danger hover:text-white"
        >
          <Delete />
        </button>
        <DeleteTooltip showDelete={showDelete} />
      </div>
    </div>
  );
};

export default MotifEditDelete;
