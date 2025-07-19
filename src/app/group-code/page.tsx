"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddGroupCode from "@/app/components/group-code/add-group-code";
import GroupCodeTable from "@/app/components/group-code/group-code-table";

export default function GroupCodePage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="GroupCode" subtitle="List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddGroupCode />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <GroupCodeTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
