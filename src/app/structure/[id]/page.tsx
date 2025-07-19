"use client";

import React from "react";
import { useParams } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import EditStructure from "@/app/components/structure/edit-structure";

export default function EditStructurePage() {
  const { id } = useParams();
  const idStr = Array.isArray(id) ? id[0] : id;

  if (!idStr) {
    return (
      <Wrapper>
        <div className="body-content px-8 py-8">
          <p className="text-red-500">No structure selected.</p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Edit Structure" subtitle="" />

        {/* Center the form in a card */}
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-md shadow p-8">
            <EditStructure id={idStr} onDone={function (): void {
              throw new Error("Function not implemented.");
            } } />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
