// src/app/content/[id]/page.tsx
"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Wrapper from "@/layout/wrapper";
import Breadcrumb from "@/app/components/breadcrumb/breadcrumb";
import EditContent from "@/app/components/content/edit-content";

export default function EditContentPage() {
  const { id } = useParams();
  const router = useRouter();
  if (!id)
    return (
      <Wrapper>
        <p>No content selected.</p>
      </Wrapper>
    );

  const contentId = Array.isArray(id) ? id[0] : id;

  return (
    <Wrapper>
      <div className="body-content px-8 py-8 bg-slate-100 min-h-screen">
        <Breadcrumb title="Edit Content" subtitle="" />
        <div className="mt-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-md shadow p-8">
            <EditContent id={contentId} onDone={() => router.push("/content")} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
