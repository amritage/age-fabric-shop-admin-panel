"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddSubSuitableFor from "@/app/components/subsuitablefor/add-subsuitable";
import SubSuitableForTable from "@/app/components/subsuitablefor/subsuitable-table";

export default function SubSuitableForPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Sub-SuitableFor" subtitle="List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddSubSuitableFor />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <SubSuitableForTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
