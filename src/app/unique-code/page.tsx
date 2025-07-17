"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddUniqueCode from "@/app/components/uniquecode/add-uniquecode";
import UniqueCodeTable from "@/app/components/uniquecode/uniquecode-table";

export default function UniqueCodePage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="UniqueCode" subtitle="List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddUniqueCode />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <UniqueCodeTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
