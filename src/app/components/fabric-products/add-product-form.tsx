// File: app/components/fabric-products/AddProductForm.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetProductByIdQuery,
  useGetProductsByGroupCodeQuery,
} from "@/redux/newproduct/NewProductApi";
import { filterConfig } from "@/utils/filterconfig";
import { useDispatch } from "react-redux";
import { setProductMedia } from "@/redux/features/productImageSlice";
import { IProduct } from "@/types/fabricproduct-type";
import { notifyError } from "@/utils/toast";
import Image from "next/image";
import Cookies from "js-cookie";
import { useGetAllNewCategoriesQuery } from '@/redux/newcategory/newcategoryApi';
import { useGetAllStructuresQuery } from '@/redux/structure/structureApi';
import { useGetAllContentQuery } from '@/redux/content/contentApi';
import { useGetAllFinishQuery } from '@/redux/finish/finishApi';
import { useGetAllDesignQuery } from '@/redux/design/designApi';
import { useGetAllColorQuery } from '@/redux/color/colorApi';
import { useGetAllMotifQuery } from '@/redux/motif/motifApi';
import { useGetAllSuitableForQuery } from '@/redux/suitablefor/suitableforApi';
import { useGetAllVendorsQuery } from '@/redux/vendor/vendorApi';
import { useGetAllGroupCodesQuery } from '@/redux/group-code/group-code-api';
import { useGetAllSubstructuresQuery } from '@/redux/substructure/substructureApi';
import { useGetAllSubFinishQuery } from '@/redux/subfinish/subfinishApi';
import { useGetAllSubSuitableForQuery } from '@/redux/subsuitablefor/subsuitableApi';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Related Products Component
const RelatedProducts = ({ groupcodeId }: { groupcodeId: string }) => {
  const {
    data: response,
    isLoading,
    error,
  } = useGetProductsByGroupCodeQuery(groupcodeId, {
    skip: !groupcodeId,
  });

  const relatedProducts = response?.data || [];

  if (!groupcodeId) return null;
  if (isLoading)
    return (
      <div className="text-sm text-gray-500">Loading related products...</div>
    );
  if (error)
    return (
      <div className="text-sm text-red-500">Error loading related products</div>
    );
  if (relatedProducts.length === 0)
    return (
      <div className="text-sm text-gray-500">
        No related products found for this group code.
      </div>
    );

  return (
    <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Related Products ({relatedProducts.length})
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
        {relatedProducts.slice(0, 6).map((product) => (
          <div
            key={product._id}
            className="bg-white p-3 rounded border text-xs"
          >
            <div className="font-medium text-gray-800 truncate">
              {product.name}
            </div>
            <div className="text-gray-600">SKU: {product.sku}</div>
            <div className="text-gray-600">
              Price: {product.salesPrice} {product.currency}
            </div>
            <div className="text-gray-600">
              GSM: {product.gsm} | OZ: {product.oz}
            </div>
          </div>
        ))}
      </div>
      {relatedProducts.length > 6 && (
        <div className="text-xs text-gray-500 mt-2">
          Showing 6 of {relatedProducts.length} related products
        </div>
      )}
    </div>
  );
};

export default function AddProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Use the productId from props if available, otherwise check search params
  const editId = productId ?? searchParams.get("editId") ?? undefined;
  const isEdit = Boolean(editId);

  // if editing, fetch the product
  const { data: productDetail, isLoading: isLoadingProductDetail } = useGetProductByIdQuery(editId!, {
    skip: !isEdit,
  });

  // Debug: Log the product detail when editing
  useEffect(() => {
    if (isEdit && productDetail) {
      console.log('Debug: productDetail for edit', productDetail);
    }
  }, [isEdit, productDetail]);

  const [formData, setFormData] = useState<Record<string, any>>({
    popularproduct: "no", // Default to "no" - user can change in metadata form
    topratedproduct: "no",
    productoffer: "no",
  });
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [filterErrors, setFilterErrors] = useState<Record<string, string>>({});
  const [hasRestoredData, setHasRestoredData] = useState(false);
  const dispatch = useDispatch();

  // Add sub-filter options state
  const [substructureOptions, setSubstructureOptions] = useState<{ _id: string; name: string }[]>([]);
  const [subfinishOptions, setSubfinishOptions] = useState<{ _id: string; name: string }[]>([]);
  const [subsuitableforOptions, setSubsuitableforOptions] = useState<{ _id: string; name: string }[]>([]);
  const [filteredSubstructures, setFilteredSubstructures] = useState<{ _id: string; name: string }[]>([]);
  const [filteredSubfinishes, setFilteredSubfinishes] = useState<{ _id: string; name: string }[]>([]);
  const [filteredSubSuitableFors, setFilteredSubSuitableFors] = useState<{ _id: string; name: string }[]>([]);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    if (!isEdit) {
      const savedFormData = localStorage.getItem('ADD_PRODUCT_FORM_DATA');
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          // Defensive: ensure productdescription is always a string
          if (Array.isArray(parsedData.productdescription)) {
            parsedData.productdescription = parsedData.productdescription.join(" ");
          } else if (typeof parsedData.productdescription !== "string") {
            parsedData.productdescription = String(parsedData.productdescription ?? "");
          }
          // Ensure flag fields are strings ("yes"/"no") from localStorage
          parsedData.popularproduct = parsedData.popularproduct === true || parsedData.popularproduct === "yes" ? "yes" : "no";
          parsedData.topratedproduct = parsedData.topratedproduct === true || parsedData.topratedproduct === "yes" ? "yes" : "no";
          parsedData.productoffer = parsedData.productoffer === true || parsedData.productoffer === "yes" ? "yes" : "no";
          
          // Debug: Log the flag values from localStorage
          console.log("Debug - Flag values from localStorage:", {
            popularproduct: parsedData.popularproduct,
            topratedproduct: parsedData.topratedproduct,
            productoffer: parsedData.productoffer
          });
          
          setFormData(parsedData);
          setHasRestoredData(true);
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      } else {
        // Keep radio fields as undefined in add mode (already set in initial state)
        // No need to explicitly set them again
      }
    }
  }, [isEdit]);

  useEffect(() => {
    if (!BASE_URL) {
      notifyError("API base URL is not set. Please configure NEXT_PUBLIC_API_BASE_URL in your environment.");
    }
  }, []);

  // Use RTK Query hooks for dropdowns
  const { data: categories, isLoading: isLoadingCategories } = useGetAllNewCategoriesQuery();
  const { data: structures, isLoading: isLoadingStructures } = useGetAllStructuresQuery();
  const { data: contents, isLoading: isLoadingContents } = useGetAllContentQuery();
  const { data: finishes, isLoading: isLoadingFinishes } = useGetAllFinishQuery();
  const { data: designs, isLoading: isLoadingDesigns } = useGetAllDesignQuery();
  const { data: colors, isLoading: isLoadingColors } = useGetAllColorQuery();
  const { data: motifs, isLoading: isLoadingMotifs } = useGetAllMotifQuery();
  const { data: suitableFors, isLoading: isLoadingSuitableFors } = useGetAllSuitableForQuery();
  const { data: vendors, isLoading: isLoadingVendors } = useGetAllVendorsQuery();
  const { data: groupCodes, isLoading: isLoadingGroupCodes } = useGetAllGroupCodesQuery();
  const { data: allSubstructures } = useGetAllSubstructuresQuery();
  const { data: allSubfinishes } = useGetAllSubFinishQuery();
  const { data: allSubsuitablefors } = useGetAllSubSuitableForQuery();

  // REMOVE the two useEffect hooks that hydrate formData from productDetail
  // REPLACE with this single useEffect:
  useEffect(() => {
    if (!productDetail) return;
    const processed = { ...productDetail };
    function extractId(val: any) {
      return val && typeof val === "object" && "_id" in val ? val._id : val || "";
    }
    processed.substructureId = extractId(processed.substructureId);
    processed.subfinishId = extractId(processed.subfinishId);
    processed.subsuitableId = extractId(processed.subsuitableId);
    processed.popularproduct = processed.popularproduct === "yes" ? "yes" : "no";
    processed.topratedproduct = processed.topratedproduct === "yes" ? "yes" : "no";
    processed.productoffer = processed.productoffer === "yes" ? "yes" : "no";
    setFormData(processed);

    // Filter sub-options
    if (processed.structureId && allSubstructures?.data) {
      const filtered = allSubstructures.data.filter((sub: any) => {
        if (!sub) return false;
        let parentId = "";
        if (sub.structureId && typeof sub.structureId === 'object' && sub.structureId !== null && '_id' in sub.structureId) {
          parentId = sub.structureId._id;
        } else if (sub.structureId) {
          parentId = sub.structureId;
        }
        return String(parentId) === String(processed.structureId);
      });
      setFilteredSubstructures(filtered);
    }
    if (processed.finishId && allSubfinishes?.data) {
      const filtered = allSubfinishes.data.filter((sub: any) => {
        if (!sub) return false;
        let parentId = "";
        if (sub.finishId && typeof sub.finishId === 'object' && sub.finishId !== null && '_id' in sub.finishId) {
          parentId = sub.finishId._id;
        } else if (sub.finishId) {
          parentId = sub.finishId;
        }
        return String(parentId) === String(processed.finishId);
      });
      setFilteredSubfinishes(filtered);
    }
    if (processed.suitableforId && allSubsuitablefors?.data) {
      const filtered = allSubsuitablefors.data.filter((sub: any) => {
        if (!sub) return false;
        let parentId = "";
        if (sub.suitableforId && typeof sub.suitableforId === 'object' && sub.suitableforId !== null && '_id' in sub.suitableforId) {
          parentId = sub.suitableforId._id;
        } else if (sub.suitableforId) {
          parentId = sub.suitableforId;
        }
        return String(parentId) === String(processed.suitableforId);
      });
      setFilteredSubSuitableFors(filtered);
    }
    ["image", "image1", "image2", "video"].forEach((key) => {
      const url = (processed as any)[key];
      if (url) {
        setPreviews((p) => ({ ...p, [key]: url }));
      }
    });
  }, [
    productDetail,
    allSubstructures,
    allSubfinishes,
    allSubsuitablefors,
  ]);

  // Filter substructures when structureId changes
  useEffect(() => {
    if (!allSubstructures?.data || !formData.structureId) {
      setFilteredSubstructures([]);
      return;
    }
    // Debug log
    console.log("[DEBUG] Filtering substructures", { allSubstructures: allSubstructures.data, structureId: formData.structureId, substructureId: formData.substructureId });
    // Accept both object and string for structureId
    let filtered = allSubstructures.data.filter((sub: any) => {
      if (!sub || !sub.structureId) return false;
      const parentId = typeof sub.structureId === 'object' && sub.structureId !== null && '_id' in sub.structureId ? sub.structureId._id : sub.structureId;
      return String(parentId) === String(formData.structureId);
    });
    // Ensure the current value is included
    if (
      formData.substructureId &&
      !filtered.some((sub: any) => String(sub._id) === String(formData.substructureId))
    ) {
      const current = allSubstructures.data.find((sub: any) => String(sub._id) === String(formData.substructureId));
      if (current) filtered = [...filtered, current];
    }
    setFilteredSubstructures(filtered);
    // Only reset if the current value is not in the filtered list and not empty
    if (
      formData.substructureId &&
      !filtered.some((sub: any) => String(sub._id) === String(formData.substructureId))
    ) {
      setFormData((prev) => ({ ...prev, substructureId: "" }));
    }
  }, [formData.structureId, formData.substructureId, allSubstructures]);

  // Filter subfinishes when finishId changes
  useEffect(() => {
    if (!allSubfinishes?.data || !formData.finishId) {
      setFilteredSubfinishes([]);
      return;
    }
    // Debug log
    console.log("[DEBUG] Filtering subfinishes", { allSubfinishes: allSubfinishes.data, finishId: formData.finishId, subfinishId: formData.subfinishId });
    let filtered = allSubfinishes.data.filter((sub: any) => {
      if (!sub || !sub.finishId) return false;
      const parentId = typeof sub.finishId === 'object' && sub.finishId !== null && '_id' in sub.finishId ? sub.finishId._id : sub.finishId;
      return String(parentId) === String(formData.finishId);
    });
    // Ensure the current value is included
    if (
      formData.subfinishId &&
      !filtered.some((sub: any) => String(sub._id) === String(formData.subfinishId))
    ) {
      const current = allSubfinishes.data.find((sub: any) => String(sub._id) === String(formData.subfinishId));
      if (current) filtered = [...filtered, current];
    }
    setFilteredSubfinishes(filtered);
    if (
      formData.subfinishId &&
      !filtered.some((sub: any) => String(sub._id) === String(formData.subfinishId))
    ) {
      setFormData((prev) => ({ ...prev, subfinishId: "" }));
    }
  }, [formData.finishId, formData.subfinishId, allSubfinishes]);

  // Filter subsuitablefors when suitableforId changes
  useEffect(() => {
    if (!allSubsuitablefors?.data || !formData.suitableforId) {
      setFilteredSubSuitableFors([]);
      return;
    }
    // Debug log
    console.log("[DEBUG] Filtering subsuitablefors", { allSubsuitablefors: allSubsuitablefors.data, suitableforId: formData.suitableforId, subsuitableId: formData.subsuitableId });
    let filtered = allSubsuitablefors.data.filter((sub: any) => {
      if (!sub || !sub.suitableforId) return false;
      const parentId = typeof sub.suitableforId === 'object' && sub.suitableforId !== null && '_id' in sub.suitableforId ? sub.suitableforId._id : sub.suitableforId;
      return String(parentId) === String(formData.suitableforId);
    });
    // Ensure the current value is included
    if (
      formData.subsuitableId &&
      !filtered.some((sub: any) => String(sub._id) === String(formData.subsuitableId))
    ) {
      const current = allSubsuitablefors.data.find((sub: any) => String(sub._id) === String(formData.subsuitableId));
      if (current) filtered = [...filtered, current];
    }
    setFilteredSubSuitableFors(filtered);
    if (
      formData.subsuitableId &&
      !filtered.some((sub: any) => String(sub._id) === String(formData.subsuitableId))
    ) {
      setFormData((prev) => ({ ...prev, subsuitableId: "" }));
    }
  }, [formData.suitableforId, formData.subsuitableId, allSubsuitablefors]);

  // generic handlers
 const handleInputChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >,
) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value }); // <-- This is required for state update
  localStorage.setItem("ADD_PRODUCT_FORM_DATA", JSON.stringify({ ...formData, [name]: value }));
};



  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0] ?? null;
    const newFormData = { ...formData, [field]: file };
    setFormData(newFormData);
    
    if (file) {
      setPreviews((p) => ({
        ...p,
        [field]: URL.createObjectURL(file),
      }));
    }
    
    // Dispatch to Redux global state
    dispatch(
      setProductMedia({
        image: field === "image" ? file : formData.image,
        image1: field === "image1" ? file : formData.image1,
        image2: field === "image2" ? file : formData.image2,
        video: field === "video" ? file : formData.video,
      }),
    );
    
    // Save to localStorage for both add and edit modes
    // Don't save file objects to localStorage, just save the field name
    const localStorageData = { ...newFormData };
    localStorageData[field] = file ? field : null; // Just mark that a file was selected
    localStorage.setItem('ADD_PRODUCT_FORM_DATA', JSON.stringify(localStorageData));
  };

  // Next → Metadata
  const goNext = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure productdescription is a string before submitting
    if (Array.isArray(formData.productdescription)) {
      formData.productdescription = formData.productdescription.join(" ");
    } else if (typeof formData.productdescription !== "string") {
      formData.productdescription = String(formData.productdescription ?? "");
    }

    // Validate required fields with more detailed checking
    const requiredFields = [
      { name: "name", label: "Product Name" },
      { name: "sku", label: "SKU" },
      { name: "slug", label: "Slug" },
      { name: "newCategoryId", label: "Category" },
      { name: "structureId", label: "Structure" },
      { name: "contentId", label: "Content" },
      { name: "gsm", label: "GSM" },
      { name: "oz", label: "OZ" },
      { name: "cm", label: "Width (CM)" },
      { name: "inch", label: "Width (Inch)" },
      { name: "um", label: "Unit (UM)" },
      { name: "currency", label: "Currency" },
      { name: "finishId", label: "Finish" },
      { name: "designId", label: "Design" },
      { name: "colorId", label: "Color" },
      { name: "motifsizeId", label: "Motif Size" },
      { name: "purchasePrice", label: "Purchase Price" },
      { name: "salesPrice", label: "Sales Price" },
      { name: "locationCode", label: "Location Code" },
      { name: "productIdentifier", label: "Product Identifier" },
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = formData[field.name];
      return !value || value === "" || value === undefined;
    });

    if (missingFields.length > 0) {
      const missingFieldNames = missingFields.map((f) => f.label).join(", ");
      notifyError(`Please fill in all required fields: ${missingFieldNames}`);
      return;
    }

    // Additional validation for numeric fields
    const numericFields = [
      "gsm",
      "oz",
      "cm",
      "inch",
      "quantity",
      "purchasePrice",
      "salesPrice",
    ];
    const invalidNumericFields = numericFields.filter((field) => {
      const value = formData[field];
      return isNaN(parseFloat(value)) || parseFloat(value) <= 0;
    });

    if (invalidNumericFields.length > 0) {
      const invalidFieldNames = invalidNumericFields
        .map((f) => {
          const field = requiredFields.find((rf) => rf.name === f);
          return field ? field.label : f;
        })
        .join(", ");
      notifyError(`Please enter valid numbers for: ${invalidFieldNames}`);
      return;
    }

    // In goNext, ensure all backend string fields are coerced to string and number fields to number
    const cleanedFormData = { ...formData };
    const stringFields = [
      "name", "productdescription",
      "newCategoryId", "structureId", "contentId", "um", "currency", "finishId", "designId",
      "colorId", "css", "motifsizeId", "suitableforId", "vendorId", "groupcodeId", "charset",
      "title", "description", "keywords", "ogTitle", "ogDescription", "ogUrl", "sku", "slug",
      "locationCode", "productIdentifier",
      "subsuitableId"
    ];
    stringFields.forEach(field => {
      cleanedFormData[field] = String(cleanedFormData[field] ?? "");
    });
    const numberFields = ["gsm", "oz", "cm", "inch", "quantity", "purchasePrice", "salesPrice"];
    numberFields.forEach(field => {
      cleanedFormData[field] = Number(cleanedFormData[field]);
    });
    // Ensure flag fields are always 'yes' or 'no' strings
    ["popularproduct", "topratedproduct", "productoffer"].forEach(field => {
      if (cleanedFormData[field] !== "yes" && cleanedFormData[field] !== "no") {
        cleanedFormData[field] = "no"; // Default to "no" if invalid
      }
    });

    // Safely set specific fields to null if empty or undefined
    const nullableFields = [
      "css",
      "locationCode",
      "quantity",
      "groupcodeId",
      "suitableforId",
      "subsuitableId",
      "vendorId",
      "uniqueCode",
    ];
    nullableFields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(cleanedFormData, field)) {
        if (cleanedFormData[field] === "" || cleanedFormData[field] === undefined) {
          cleanedFormData[field] = null;
        }
      }
    });
    


    // Debug: Log the flag values before saving to cookie
    console.log("Debug - Flag values before saving to cookie:", {
      popularproduct: cleanedFormData.popularproduct,
      topratedproduct: cleanedFormData.topratedproduct,
      productoffer: cleanedFormData.productoffer
    });
    
    Cookies.set("NEW_PRODUCT_BASE", JSON.stringify(cleanedFormData));
    // Clear localStorage when moving to metadata (form is complete)
    localStorage.removeItem('ADD_PRODUCT_FORM_DATA');
    router.push(
      isEdit
        ? `/fabric-products/metadata?editId=${editId}`
        : `/fabric-products/metadata`,
    );
  };
  // Remove all <console.log(...)> and commented-out <console.log(...)> from inside JSX
  // Place debug logs here, before return
  console.log('formData.substructureId:', formData.substructureId);
  console.log('filteredSubstructures:', filteredSubstructures.map(s => s._id));
  console.log('formData.subfinishId:', formData.subfinishId);
  console.log('filteredSubfinishes:', filteredSubfinishes.map(s => s._id));
  console.log('formData.subsuitableId:', formData.subsuitableId);
  console.log('filteredSubSuitableFors:', filteredSubSuitableFors.map(s => s._id));
  console.log('Debug: productDetail for edit', productDetail);
  console.log('Debug: formData', formData);
  return (
    <div className="w-full min-h-screen flex justify-center items-start py-8">
      <form
        onSubmit={goNext}
        className="w-full max-w-7xl bg-white rounded-xl shadow-md p-8 space-y-8"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6 tracking-tight drop-shadow-sm">
          {isEdit ? "Edit" : "Add New"} Fabric Product
        </h1>

        {/* Loading and Error Indicators */}
        {/* {isLoadingFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-800 text-sm">
                Loading dropdown options...
              </span>
            </div>
          </div>
        )} */}

        {/* Data Restored Notification */}
        {hasRestoredData && !isEdit && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-green-600 mr-2">✓</div>
                <span className="text-green-800 text-sm">
                  Your previous form data has been restored from local storage.
                </span>
              </div>
              <button
                onClick={() => setHasRestoredData(false)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {Object.keys(filterErrors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h3 className="text-red-800 font-medium text-sm mb-2">
              Some dropdowns failed to load:
            </h3>
            <ul className="text-red-700 text-sm space-y-1">
              {Object.entries(filterErrors).map(([fieldName, error]) => (
                <li key={fieldName}>• {error}</li>
              ))}
            </ul>
            <p className="text-red-600 text-xs mt-2">
              Please refresh the page or check if the backend server is running
              properly.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* SKU */}
          <div>
            <label
              htmlFor="sku"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              id="sku"
              name="sku"
              required
              value={formData.sku || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              required
              value={formData.slug || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* Product Identifier */}
          <div>
            <label
              htmlFor="productIdentifier"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Product Identifier <span className="text-red-500">*</span>
            </label>
            <input
              id="productIdentifier"
              name="productIdentifier"
              required
              value={formData.productIdentifier || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* Location Code */}
          <div>
            <label
              htmlFor="locationCode"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Location Code <span className="text-red-500">*</span>
            </label>
            <input
              id="locationCode"
              name="locationCode"
              required
              maxLength={3}
              value={formData.locationCode || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* CSS */}
          <div>
            <label
              htmlFor="css"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              CSS
            </label>
            <input
              id="css"
              name="css"
              value={formData.css || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* Quantity */}
          <div>
            <label
              htmlFor="quantity"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* Unit */}
          <div>
            <label
              htmlFor="um"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Unit (UM) <span className="text-red-500">*</span>
            </label>
            <select
              id="um"
              name="um"
              required
              value={formData.um || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Unit</option>
              <option value="meter">Meters</option>
              <option value="yard">Yards</option>
              <option value="kgs">kgs</option>
            </select>
          </div>

          {/* Purchase Price */}
          <div>
            <label
              htmlFor="purchasePrice"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Purchase Price <span className="text-red-500">*</span>
            </label>
            <input
              id="purchasePrice"
              name="purchasePrice"
              type="number"
              required
              value={formData.purchasePrice || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* Sales Price */}
          <div>
            <label
              htmlFor="salesPrice"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Sales Price <span className="text-red-500">*</span>
            </label>
            <input
              id="salesPrice"
              name="salesPrice"
              type="number"
              required
              value={formData.salesPrice || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* Currency */}
          <div>
            <label
              htmlFor="currency"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              id="currency"
              name="currency"
              required
              value={formData.currency || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Currency</option>
              <option>INR</option>
              <option>USD</option>
            </select>
          </div>

          {/* GSM → OZ */}
          <div>
            <label
              htmlFor="gsm"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              GSM <span className="text-red-500">*</span>
            </label>
            <input
              id="gsm"
              name="gsm"
              type="number"
              required
              value={formData.gsm || ""}
              onChange={(e) => {
                handleInputChange(e);
                const v = parseFloat(e.target.value);
                if (!isNaN(v)) {
                  setFormData((p) => ({ ...p, oz: (v * 0.0295).toFixed(2) }));
                }
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="oz"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              OZ <span className="text-red-500">*</span>
            </label>
            <input
              id="oz"
              name="oz"
              readOnly
              required
              value={formData.oz || ""}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* Width CM → Inch */}
          <div>
            <label
              htmlFor="cm"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Width (CM) <span className="text-red-500">*</span>
            </label>
            <input
              id="cm"
              name="cm"
              type="number"
              required
              value={formData.cm || ""}
              onChange={(e) => {
                handleInputChange(e);
                const v = parseFloat(e.target.value);
                if (!isNaN(v)) {
                  setFormData((p) => ({
                    ...p,
                    inch: (v * 0.393701).toFixed(2),
                  }));
                }
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>
          <div>
            <label
              htmlFor="inch"
              className="block font-bold text-gray-800 text-lg mb-2"
            >
              Width (Inch) <span className="text-red-500">*</span>
            </label>
            <input
              id="inch"
              name="inch"
              readOnly
              required
              value={formData.inch || ""}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            />
          </div>

          {/* Dynamic filters */}
          <div className="mb-6">
            <label htmlFor="newCategoryId" className="block font-bold text-gray-800 text-lg mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="newCategoryId"
              name="newCategoryId"
              value={formData.newCategoryId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Category</option>
              {categories?.data?.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="structureId" className="block font-bold text-gray-800 text-lg mb-2">
              Structure <span className="text-red-500">*</span>
            </label>
            <select
              id="structureId"
              name="structureId"
              value={formData.structureId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Structure</option>
              {structures?.data?.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="contentId" className="block font-bold text-gray-800 text-lg mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <select
              id="contentId"
              name="contentId"
              value={formData.contentId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Content</option>
              {contents?.data?.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="finishId" className="block font-bold text-gray-800 text-lg mb-2">
              Finish <span className="text-red-500">*</span>
            </label>
            <select
              id="finishId"
              name="finishId"
              value={formData.finishId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Finish</option>
              {finishes?.data?.map((f) => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="designId" className="block font-bold text-gray-800 text-lg mb-2">
              Design <span className="text-red-500">*</span>
            </label>
            <select
              id="designId"
              name="designId"
              value={formData.designId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Design</option>
              {designs?.data?.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="colorId" className="block font-bold text-gray-800 text-lg mb-2">
              Color <span className="text-red-500">*</span>
            </label>
            <select
              id="colorId"
              name="colorId"
              value={formData.colorId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Color</option>
              {colors?.data?.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="motifsizeId" className="block font-bold text-gray-800 text-lg mb-2">
              Motif Size <span className="text-red-500">*</span>
            </label>
            <select
              id="motifsizeId"
              name="motifsizeId"
              value={formData.motifsizeId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Motif Size</option>
              {motifs?.data?.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="suitableforId" className="block font-bold text-gray-800 text-lg mb-2">
              Suitable For <span className="text-red-500">*</span>
            </label>
            <select
              id="suitableforId"
              name="suitableforId"
              value={formData.suitableforId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Suitable For</option>
              {suitableFors?.data?.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="vendorId" className="block font-bold text-gray-800 text-lg mb-2">
              Vendor
            </label>
            <select
              id="vendorId"
              name="vendorId"
              value={formData.vendorId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Vendor</option>
              {vendors?.data?.map((v) => (
                <option key={v._id} value={v._id}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="groupcodeId" className="block font-bold text-gray-800 text-lg mb-2">
              Group Code
            </label>
            <select
              id="groupcodeId"
              name="groupcodeId"
              value={formData.groupcodeId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
            >
              <option value="">Select Group Code</option>
              {groupCodes?.data?.map((g) => (
                <option key={g._id} value={g._id}>{g.name}</option>
              ))}
            </select>
            {formData.groupcodeId && (
              <RelatedProducts groupcodeId={formData.groupcodeId} />
            )}
          </div>

          {/* Sub Structure */}
          <div className="mb-6">
            <label className="block font-bold text-gray-800 text-lg mb-2">
              Sub Structure
            </label>
            <select
              name="substructureId"
              value={formData.substructureId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm"
            >
              <option value="">Select Sub Structure</option>
              {filteredSubstructures.map(option => (
                <option key={option._id} value={option._id}>{option.name}</option>
              ))}
            </select>
            {/* Debug logs before substructure dropdown */}
            {/* <console.log('formData.substructureId:', formData.substructureId); */}
            {/* <console.log('filteredSubstructures:', filteredSubstructures.map(s => s._id)); */}
          </div>
          {/* Sub Finish */}
          <div className="mb-6">
            <label className="block font-bold text-gray-800 text-lg mb-2">
              Sub Finish
            </label>
            <select
              name="subfinishId"
              value={formData.subfinishId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm"
            >
              <option value="">Select Sub Finish</option>
              {filteredSubfinishes.map(option => (
                <option key={option._id} value={option._id}>{option.name}</option>
              ))}
            </select>
            {/* Debug logs before subfinish dropdown */}
            {/* <console.log('formData.subfinishId:', formData.subfinishId); */}
            {/* <console.log('filteredSubfinishes:', filteredSubfinishes.map(s => s._id)); */}
          </div>
          {/* Sub Suitable For */}
          <div className="mb-6">
            <label className="block font-bold text-gray-800 text-lg mb-2">
              Sub Suitable For
            </label>
            <select
              name="subsuitableId"
              value={formData.subsuitableId || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm"
            >
              <option value="">Select Sub Suitable For</option>
              {filteredSubSuitableFors.map(option => (
                <option key={option._id} value={option._id}>{option.name}</option>
              ))}
            </select>
            {/* Debug logs before subsuitablefor dropdown */}
            {/* <console.log('formData.subsuitableId:', formData.subsuitableId); */}
            {/* <console.log('filteredSubSuitableFors:', filteredSubSuitableFors.map(s => s._id)); */}
          </div>
        </div>

        {/* Uploads & previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["image", "image1", "image2", "video"].map((key) => (
            <div key={key} className="mb-6">
              <label className="block font-bold text-gray-800 text-lg mb-2">
                {key === "video" ? "Upload Video" : `Upload ${key}`}
              </label>
              <input
                type="file"
                name={key}
                accept={key === "video" ? "video/*" : "image/*"}
                onChange={(e) => handleFileChange(e, key)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
              />
              {previews[key] &&
                (key === "video" ? (
                  <video
                    src={previews[key]}
                    controls
                    className="mt-2 w-full h-32 rounded border border-gray-200 bg-gray-50"
                  />
                ) : (
                  <div className="mt-2 w-full aspect-[16/9] relative rounded border border-gray-200 bg-gray-50 overflow-hidden">
                    <Image
                      src={previews[key]}
                      alt={key}
                      fill
                      unoptimized
                      className="object-cover"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>

      {/* Product Flags Note */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-8">
        <div className="flex items-center">
          <div className="text-blue-600 mr-3">ℹ️</div>
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Product Flags
            </p>
            <p className="text-xs text-blue-600">
              You can set Popular Product, Top Rated, and Product Offer flags on the next page.
            </p>
          </div>
        </div>
      </div>



        <div className="flex justify-between mt-8">
          {!isEdit && (
            <button
              type="button"
              onClick={() => {
                setFormData({});
                localStorage.removeItem('ADD_PRODUCT_FORM_DATA');
              }}
              className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all text-lg"
            >
              Clear Form
            </button>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all text-lg"
          >
            Next → Metadata
          </button>
        </div>
      </form>
    </div>
  );
}