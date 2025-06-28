// src/app/colors/[id]/page.tsx
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import EditColor from "@/app/components/color/edit-color";

export default function EditColorPage() {
  const { id } = useParams();
  const router = useRouter();
  if (!id)
    return (
      <Wrapper>
        <p className="p-8 text-red-500">No color selected.</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Edit Color" subtitle="" />
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-md shadow p-8">
            <EditColor />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
