// src/app/content/page.tsx
"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddContent from "@/app/components/content/add-content";
import ContentTable from "@/app/components/content/content-table";

export default function ContentPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Content" subtitle="Content List" />

        <div className="grid grid-cols-12 gap-6 mt-4">
          {/* ← Add form */}
          <div className="col-span-12 lg:col-span-4">
            <AddContent />
          </div>
          {/* → Table */}
          <div className="col-span-12 lg:col-span-8">
            <ContentTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
