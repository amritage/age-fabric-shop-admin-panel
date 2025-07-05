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
import { clearProductMedia } from "@/redux/features/productImageSlice";
import { notifySuccess, notifyError } from "@/utils/toast";
import Cookies from "js-cookie";

export default function MetadataPage() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("editId");

  const [baseData, setBaseData] = useState<Record<string, any> | null>(null);
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { image, image1, image2, video } = useSelector(
    (state: any) => state.productMedia,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    let raw = Cookies.get("NEW_PRODUCT_BASE");
    if (Array.isArray(raw)) raw = raw[0];
    if (!raw) {
      router.replace("/fabric-products/add");
      return;
    }
    const parsed = JSON.parse(raw);
    
    // Debug: Log the flag values loaded from cookie
    console.log("Debug - Flag values loaded from cookie:", {
      popularproduct: parsed.popularproduct,
      topratedproduct: parsed.topratedproduct,
      productoffer: parsed.productoffer
    });
    
    setBaseData(parsed);
  }, [router]);

  const handleMetadataSubmit = async (meta: Record<string, any>) => {
    if (!baseData) return;

    // DO NOT submit the internal _id in the update payload
    const fullData = { ...baseData, ...meta };
    if (fullData._id) {
      delete fullData._id;
    }
    
    // Debug: Log the flag values
    console.log("Debug - Flag values in fullData:", {
      popularproduct: fullData.popularproduct,
      topratedproduct: fullData.topratedproduct,
      productoffer: fullData.productoffer
    });
    
    const fd = new FormData();

    // Append all text-based data except description fields and flag fields
    for (const key in fullData) {
      if (
        fullData[key] != null &&
        fullData[key] !== "" &&
        key !== "description_html" && // skip, handled below
        key !== "isProductOffer" &&
        key !== "isTopRated" &&
        key !== "isPopular" &&
        key !== "productoffer" && // exclude from loop
        key !== "topratedproduct" && // exclude from loop
        key !== "popularproduct" // exclude from loop
      ) {
        fd.append(key, fullData[key]);
      }
    }

    // Always use Add Product Form's productdescription for productdescription
    let productDescription = baseData.productdescription;
    if (Array.isArray(productDescription)) {
      productDescription = productDescription.join(" ");
    } else if (typeof productDescription !== "string") {
      productDescription = String(productDescription ?? "");
    }
    fd.append("productdescription", productDescription);

    // Always use Metadata Form's description_html for meta description
    let metaDescription = meta.description_html;
    if (Array.isArray(metaDescription)) {
      metaDescription = metaDescription.join(" ");
    } else if (typeof metaDescription !== "string") {
      metaDescription = String(metaDescription ?? "");
    }
    fd.append("description_html", metaDescription);

    // Handle flag fields - convert from string "yes"/"no" to "yes"/"no"
    fd.append("popularproduct", fullData.popularproduct === "yes" ? "yes" : "no");
    fd.append("productoffer", fullData.productoffer === "yes" ? "yes" : "no");
    fd.append("topratedproduct", fullData.topratedproduct === "yes" ? "yes" : "no");

    // Debug: Log what's being sent to API
    console.log("Debug - Final flag values being sent to API:", {
      popularproduct: fullData.popularproduct === "yes" ? "yes" : "no",
      productoffer: fullData.productoffer === "yes" ? "yes" : "no",
      topratedproduct: fullData.topratedproduct === "yes" ? "yes" : "no"
    });

    // Explicitly append file data from Redux store
    if (image) fd.append("image", image);
    if (image1) fd.append("image1", image1);
    if (image2) fd.append("image2", image2);
    if (video) fd.append("video", video);

    try {
      if (editId) {
        await updateProduct({ id: editId, body: fd }).unwrap();
      } else {
        await addProduct(fd).unwrap();
      }

      Cookies.remove("NEW_PRODUCT_BASE");
      dispatch(clearProductMedia()); // Clear Redux state after submission
      
      // Clear localStorage when product is successfully saved
      if (!editId) {
        localStorage.removeItem('ADD_PRODUCT_FORM_DATA');
      }
      
      notifySuccess("Product saved successfully!");
      router.push("/fabric-products/view");
    } catch (err: any) {
      let message = "Failed to save product";
      if (
        typeof err.data?.message === "string" &&
        err.data.message.includes("Duplicate key error")
      ) {
        const field = err.data.errorMessages?.[0]?.path || "field";
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
      if (baseData) {
        localStorage.setItem('ADD_PRODUCT_FORM_DATA', JSON.stringify(baseData));
      }
      router.push("/fabric-products/add");
    }
  };

  if (!baseData) return null; // or a loader

  return (
    <Wrapper>
      <div className="py-12">
        <h1 className="text-2xl font-bold text-center mb-6">
          Product Metadata
        </h1>
        <MetadataForm
          initial={baseData}
          onSubmit={handleMetadataSubmit}
          onBack={goBack}
        />
      </div>
    </Wrapper>
  );
}
