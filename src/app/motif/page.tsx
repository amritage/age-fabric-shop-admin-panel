"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddMotif from "@/app/components/motif/add-motif";
import MotifTable from "@/app/components/motif/motif-table";

export default function MotifPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Motif" subtitle="Motif List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddMotif />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <MotifTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
