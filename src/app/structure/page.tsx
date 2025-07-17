"use client";
// src/app/structure/page.tsx
import React, { useState } from "react";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import AddStructure from "@/app/components/structure/add-structure";
import EditStructure from "@/app/components/structure/edit-structure";
import StructureTable from "@/app/components/structure/structure-table";

export default function StructurePage() {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100">
        <Breadcrumb title="Structure" subtitle="Structure List" />

        <div className="grid grid-cols-12 gap-6 mt-4">
          {/* ← Left: Add form or Edit form */}
          <div className="col-span-12 lg:col-span-4">
            {editingId ? (
              <EditStructure id={editingId} onDone={() => setEditingId(null)} />
            ) : (
              <AddStructure />
            )}
          </div>

          {/* → Right: the table, with inline edit callbacks */}
          <div className="col-span-12 lg:col-span-8">
            <StructureTable onEditClick={setEditingId} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
