"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import EditGroupCode from "@/app/components/group-code/edit-group-code";

export default function EditUniqueCodePage() {
  const { id } = useParams();
  const idStr = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  if (!idStr)
    return (
      <Wrapper>
        <p className="p-8 text-red-500">No item selected.</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Edit UniqueCode" subtitle="" />
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-md shadow p-8">
            <EditGroupCode id={idStr} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
