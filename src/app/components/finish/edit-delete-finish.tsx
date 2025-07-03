// src/components/finish/FinishEditDelete.tsx
"use client";

import { Delete, Edit } from "@/svg";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import DeleteTooltip from "../tooltip/delete-tooltip";
import EditTooltip from "../tooltip/edit-tooltip";
import { useDeleteFinishMutation } from "@/redux/finish/finishApi";
import { notifyError } from "@/utils/toast";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
};

const FinishEditDelete: React.FC<Props> = ({ id }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const [deleteFinish] = useDeleteFinishMutation();

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
        router.push("/finish");
      } catch (err: any) {
        if (err?.data?.message) {
          notifyError(err.data.message);
        } else {
          notifyError("Failed to delete finish item.");
        }
      }
    }
  };

  return (
    <div className="flex space-x-2">
      {/* Edit button */}
      <div className="relative">
        <Link href={`/finish/${id}`}>
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
          className="w-8 h-8 flex items-center justify-center bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:text-white"
        >
          <Delete />
        </button>
        <DeleteTooltip showDelete={showDelete} />
      </div>
    </div>
  );
};

export default FinishEditDelete;
