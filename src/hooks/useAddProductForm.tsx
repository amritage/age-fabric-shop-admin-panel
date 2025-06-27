"use client";
import React from "react";
import { useRouter } from "next/navigation";

export function useAddProductForm() {
  const router = useRouter();
  return { router };
}

// ... existing code ... 