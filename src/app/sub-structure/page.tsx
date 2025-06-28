"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddSubstructure from "@/app/components/substructure/add-substructure";
import SubstructureTable from "@/app/components/substructure/substructure-table";

export default function SubstructurePage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Substructure" subtitle="List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddSubstructure />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <SubstructureTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
