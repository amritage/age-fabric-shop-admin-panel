// src/app/categories/page.tsx
"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddCategory from "@/app/components/newcategory/add-newcategory";
import CategoryTable from "@/app/components/newcategory/newcategory-table";
import { useRouter } from "next/navigation";

export default function CategoryPage() {
  const router = useRouter();
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Categories" subtitle="Category List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddCategory />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <CategoryTable onEditClick={(id) => router.push(`/newcategory/${id}`)} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
