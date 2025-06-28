"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddSubFinish from "@/app/components/subfinish/add-subfinish";
import SubFinishTable from "@/app/components/subfinish/subfinish-table";

export default function SubFinishPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Sub-Finish" subtitle="List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddSubFinish />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <SubFinishTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
