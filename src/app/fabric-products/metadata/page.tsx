// File: app/fabric-products/metadata/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MetadataForm from "@/app/components/fabric-products/metadataform";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "@/redux/newproduct/NewProductApi";
import Wrapper from "@/layout/wrapper";
import { useSelector, useDispatch } from "react-redux";
import { clearProductMedia } from '@/redux/features/productImageSlice';
import { notifySuccess, notifyError } from "@/utils/toast";

export default function MetadataPage() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("editId");

  const [baseData, setBaseData] = useState<Record<string, any> | null>(null);
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { image, image1, image2, video } = useSelector((state: any) => state.productMedia);
  const dispatch = useDispatch();

  useEffect(() => {
    const raw = localStorage.getItem("NEW_PRODUCT_BASE");
    if (!raw) {
      router.replace("/fabric-products/add");
      return;
    }
    setBaseData(JSON.parse(raw));
  }, [router]);

  const handleMetadataSubmit = async (meta: Record<string, any>) => {
    if (!baseData) return;

    const fullData = { ...baseData, ...meta };
    // DO NOT submit the internal _id in the update payload
    if (fullData._id) {
      delete fullData._id;
    }
    // Debug: log the data being sent to the backend
    console.log('Submitting product data:', fullData);
    const fd = new FormData();

    // Append all text-based data
    for (const key in fullData) {
      if (fullData[key] != null && fullData[key] !== "") {
        // Skip frontend-only keys that need remapping
        if (["description", "isProductOffer", "isTopRated"].includes(key)) continue;
        fd.append(key, fullData[key]);
      }
    }
    // Map frontend fields to backend-required keys
    fd.append('productdescription', fullData.description || '');
    fd.append('description', fullData.description || '');
    fd.append('productoffer', fullData.isProductOffer ? 'yes' : 'no');
    fd.append('topratedproduct', fullData.isTopRated ? 'yes' : 'no');

    // Explicitly append file data from Redux store
    if (image) fd.append('image', image);
    if (image1) fd.append('image1', image1);
    if (image2) fd.append('image2', image2);
    if (video) fd.append('video', video);

    try {
      if (editId) {
        await updateProduct({ id: editId, body: fd }).unwrap();
      } else {
        await addProduct(fd).unwrap();
      }

      localStorage.removeItem("NEW_PRODUCT_BASE");
      dispatch(clearProductMedia()); // Clear Redux state after submission
      notifySuccess("Product saved successfully!");
      router.push("/fabric-products/view");

    } catch (err: any) {
      console.error("Product mutation failed:", err);
      let message = "Failed to save product";
      // Check for a specific duplicate key error message from the backend
      if (typeof err.data?.message === 'string' && err.data.message.includes('Duplicate key error')) {
        const field = err.data.errorMessages?.[0]?.path || 'field';
        message = `This ${field} is already in use by another product. Please choose a different one.`;
      } else if (err.data?.errorMessages) {
        message = err.data.errorMessages
          .map((e: any) => `${e.path}: ${e.message}`)
          .join("\n");
      } else if (err.data?.message) {
        message = err.data.message;
      }
      notifyError(message);
    }
  };

  const goBack = () => {
    if (editId) {
      router.push(`/fabric-products/edit/${editId}`);
    } else {
      router.push("/fabric-products/add");
    }
  };

  if (!baseData) return null; // or a loader

  return (
    <Wrapper>
      <div className="py-12">
        <h1 className="text-2xl font-bold text-center mb-6">Product Metadata</h1>
        <MetadataForm
          initial={baseData}
          onSubmit={handleMetadataSubmit}
          onBack={goBack}
        />
      </div>
    </Wrapper>
  );
}
