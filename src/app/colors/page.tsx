// src/app/colors/page.tsx
"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddColor from "@/app/components/color/add-color";
import ColorTable from "@/app/components/color/color-table";

export default function ColorPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Colors" subtitle="Color List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddColor />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <ColorTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
