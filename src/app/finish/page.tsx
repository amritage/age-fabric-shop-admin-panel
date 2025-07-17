// src/app/finish/page.tsx
"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddFinish from "@/app/components/finish/add-finish";
import FinishTable from "@/app/components/finish/finish-table";

export default function FinishPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Finish" subtitle="Finish List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddFinish />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <FinishTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
