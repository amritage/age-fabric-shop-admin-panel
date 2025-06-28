"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddSuitableFor from "@/app/components/suitablefor/add-suitable";
import SuitableForTable from "@/app/components/suitablefor/suitable-table";

export default function SuitableForPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="SuitableFor" subtitle="List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddSuitableFor />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <SuitableForTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
