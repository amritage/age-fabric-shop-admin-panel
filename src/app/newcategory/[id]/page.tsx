// src/app/categories/[id]/page.tsx
"use client";
import React from "react";
import { useParams } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import EditCategory from "@/app/components/newcategory/edit-newcategory";

export default function EditCategoryPage() {
  const { id } = useParams();
  if (!id) {
    return (
      <Wrapper>
        <p className="p-8 text-red-500">No category selected.</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Edit Category" subtitle="" />
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-md shadow p-8">
            <EditCategory />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
