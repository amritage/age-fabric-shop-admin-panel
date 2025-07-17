// src/app/design/page.tsx
"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddDesign from "@/app/components/design/add-design";
import DesignTable from "@/app/components/design/design-table";

export default function DesignPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Design" subtitle="Design List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddDesign />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <DesignTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
