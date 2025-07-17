"use client";
import React from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddVendor from "@/app/components/vendor/add-vendor";
import VendorTable from "@/app/components/vendor/vendor-table";

export default function VendorPage() {
  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Vendor" subtitle="Vendor List" />
        <div className="grid grid-cols-12 gap-6 mt-4">
          <div className="col-span-12 lg:col-span-4">
            <AddVendor />
          </div>
          <div className="col-span-12 lg:col-span-8">
            <VendorTable />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
