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
  const { data: productDetail } = useGetProductByIdQuery(editId!, {
    skip: !isEdit,
  });

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [filters, setFilters] = useState<
    { name: string; label: string; options: any[] }[]
  >([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [filterErrors, setFilterErrors] = useState<Record<string, string>>({});
  const [hasRestoredData, setHasRestoredData] = useState(false);
  const dispatch = useDispatch();

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
          setFormData(parsedData);
          setHasRestoredData(true);
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      }
    }
  }, [isEdit]);

  useEffect(() => {
    if (!BASE_URL) {
      notifyError("API base URL is not set. Please configure NEXT_PUBLIC_API_BASE_URL in your environment.");
    }
  }, []);

  // load all filter dropdowns from your backend
  useEffect(() => {
    (async () => {
      setIsLoadingFilters(true);
      setFilterErrors({});

      // Updated token extraction logic
      const adminCookie = typeof window !== "undefined" ? Cookies.get("admin") : null;
      let token = "";
      if (adminCookie) {
        try {
          const adminObj = JSON.parse(adminCookie);
          token = adminObj.accessToken;
        } catch (e) {
          token = "";
        }
      }

      try {
        const results = await Promise.all(
          filterConfig.map(async (f) => {
            const url = `${BASE_URL}${f.api}`;
            try {
              const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
              });
              if (!response.ok) {
                throw new Error(
                  `HTTP ${response.status}: ${response.statusText}`,
                );
              }
              const data = await response.json();
              return data;
            } catch (error) {
              setFilterErrors((prev) => ({
                ...prev,
                [f.name]: `Failed to load ${f.label}`,
              }));
              return { data: [] };
            }
          }),
        );

        setFilters(
          filterConfig.map((f, i) => ({
            name: f.name,
            label: f.label,
            options: results[i].data || [],
          })),
        );
      } catch (error) {
      } finally {
        setIsLoadingFilters(false);
      }
    })();
  }, []);

  // when productDetail arrives, seed form + previews
  useEffect(() => {
    if (!productDetail) return;
    const processedProductDetail = { ...productDetail };
    // Ensure flags are always 'yes' or 'no'
    processedProductDetail.productoffer = processedProductDetail.productoffer === "yes" ? "yes" : "no";
    processedProductDetail.popularproduct = processedProductDetail.popularproduct === "yes" ? "yes" : "no";
    processedProductDetail.topratedproduct = processedProductDetail.topratedproduct === "yes" ? "yes" : "no";
    // Helper type guard
    function isObjWithId(val: unknown): val is { _id: string } {
      return val !== null && typeof val === "object" && "_id" in val && typeof (val as any)._id === "string";
    }
    processedProductDetail.substructureId =
      isObjWithId(processedProductDetail.substructureId)
        ? processedProductDetail.substructureId._id
        : processedProductDetail.substructureId || "";
    processedProductDetail.subfinishId =
      isObjWithId(processedProductDetail.subfinishId)
        ? processedProductDetail.subfinishId._id
        : processedProductDetail.subfinishId || "";
    processedProductDetail.subsuitableforId =
      isObjWithId(processedProductDetail.subsuitableforId)
        ? processedProductDetail.subsuitableforId._id
        : processedProductDetail.subsuitableforId || "";
    setFormData(processedProductDetail);
    ["image", "image1", "image2", "video"].forEach((key) => {
      const url = (processedProductDetail as any)[key];
      if (url) {
        setPreviews((p) => ({ ...p, [key]: url }));
      }
    });
  }, [productDetail]);

  // generic handlers
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    // if (name === "productdescription") {
    //   console.log("Input value for productdescription:", value, typeof value, Array.isArray(value));
    // }
    let newValue = value;
    const newFormData = { ...formData, [name]: newValue };
    setFormData(newFormData);
    // Save to localStorage (only for new products, not editing)
    if (!isEdit) {
      localStorage.setItem('ADD_PRODUCT_FORM_DATA', JSON.stringify(newFormData));
    }
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
    
    // Save to localStorage (only for new products, not editing)
    if (!isEdit) {
      // Don't save file objects to localStorage, just save the field name
      const localStorageData = { ...newFormData };
      localStorageData[field] = file ? field : null; // Just mark that a file was selected
      localStorage.setItem('ADD_PRODUCT_FORM_DATA', JSON.stringify(localStorageData));
    }
  };

  // Next → Metadata
  const goNext = (e: React.FormEvent) => {
    e.preventDefault();

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
      { name: "quantity", label: "Quantity" },
      { name: "um", label: "Unit (UM)" },
      { name: "currency", label: "Currency" },
      { name: "finishId", label: "Finish" },
      { name: "designId", label: "Design" },
      { name: "colorId", label: "Color" },
      { name: "css", label: "CSS" },
      { name: "motifsizeId", label: "Motif Size" },
      { name: "suitableforId", label: "Suitable For" },
      { name: "vendorId", label: "Vendor" },
      { name: "groupcodeId", label: "Group Code" },
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
      "name", "productdescription", "popularproduct", "productoffer", "topratedproduct",
      "newCategoryId", "structureId", "contentId", "um", "currency", "finishId", "designId",
      "colorId", "css", "motifsizeId", "suitableforId", "vendorId", "groupcodeId", "charset",
      "title", "description", "keywords", "ogTitle", "ogDescription", "ogUrl", "sku", "slug",
      "locationCode", "productIdentifier"
    ];
    stringFields.forEach(field => {
      cleanedFormData[field] = String(cleanedFormData[field] ?? "");
    });
    const numberFields = ["gsm", "oz", "cm", "inch", "quantity", "purchasePrice", "salesPrice"];
    numberFields.forEach(field => {
      cleanedFormData[field] = Number(cleanedFormData[field]);
    });

    // Map isPopular to popularproduct for backend
    cleanedFormData.popularproduct = formData.isPopular === true ? "yes" : "no";
    delete cleanedFormData.isPopular;
    ["image", "image1", "image2", "video"].forEach((key) => {
      delete cleanedFormData[key];
    });

    // Ensure productdescription is always a string before saving/submitting
    // console.log("Before submit: productdescription =", cleanedFormData.productdescription, typeof cleanedFormData.productdescription, Array.isArray(cleanedFormData.productdescription));
    // if (Array.isArray(cleanedFormData.productdescription)) {
    //   cleanedFormData.productdescription = cleanedFormData.productdescription.join(" ");
    // } else if (typeof cleanedFormData.productdescription !== "string") {
    //   cleanedFormData.productdescription = String(cleanedFormData.productdescription ?? "");
    // }

    // Coerce productoffer, popularproduct, and topratedproduct to string before submit
    ["productoffer", "popularproduct", "topratedproduct"].forEach(field => {
      if (Array.isArray(cleanedFormData[field])) {
        cleanedFormData[field] = cleanedFormData[field][0] || "";
      } else if (typeof cleanedFormData[field] !== "string") {
        cleanedFormData[field] = String(cleanedFormData[field] ?? "");
      }
    });

    Cookies.set("NEW_PRODUCT_BASE", JSON.stringify(cleanedFormData));
    // Clear localStorage when moving to metadata (form is complete)
    if (!isEdit) {
      localStorage.removeItem('ADD_PRODUCT_FORM_DATA');
    }
    router.push(
      isEdit
        ? `/fabric-products/metadata?editId=${editId}`
        : `/fabric-products/metadata`,
    );
  };

  console.log("formData.substructureId", formData.substructureId);
  console.log("formData.subfinishId", formData.subfinishId);
  console.log("formData.subsuitableforId", formData.subsuitableforId);
  console.log("filters", filters);

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
        {isLoadingFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-800 text-sm">
                Loading dropdown options...
              </span>
            </div>
          </div>
        )}

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
              CSS <span className="text-red-500">*</span>
            </label>
            <input
              id="css"
              name="css"
              required
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
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              required
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
          {filters.map((f) => (
            <div key={f.name} className="mb-6">
              <label
                htmlFor={f.name}
                className="block font-bold text-gray-800 text-lg mb-2"
              >
                {f.label} <span className="text-red-500">*</span>
              </label>
              <select
                id={f.name}
                name={f.name}
                required
                value={formData[f.name] || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white"
              >
                <option value="">Select {f.label}</option>
                {f.options.map((o: any) => (
                  <option key={o._id} value={o._id}>
                    {o.name}
                  </option>
                ))}
              </select>

              {/* Show related products for Group Code */}
              {f.name === "groupcodeId" && (
                <>
                  <div className="text-xs text-blue-600 mt-1 mb-2">
                    💡 Group Code helps organize related products. When selected,
                    you&apos;ll see other products with the same group code below.
                  </div>
                  {formData[f.name] && (
                    <RelatedProducts groupcodeId={formData[f.name]} />
                  )}
                </>
              )}
            </div>
          ))}
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
                  <Image
                    src={previews[key]}
                    alt={key}
                    width={320}
                    height={128}
                    unoptimized
                    className="mt-2 w-full h-32 object-cover rounded border border-gray-200 bg-gray-50"
                  />
                ))}
            </div>
          ))}
        </div>

        {/* Product Flags (Popular, Top Rated, Product Offer) */}
        <div className="flex flex-wrap gap-8 items-center mt-8">
          {/* Popular Product */}
          <div>
            <span className="block font-bold text-gray-800 text-lg mb-2">Popular Product:</span>
            <label className="text-xl font-bold mr-2">
              <input
                type="radio"
                name="popularproduct"
                value="yes"
                checked={formData.popularproduct === "yes"}
                onChange={handleInputChange}
                className="w-6 h-6 accent-indigo-600 border-gray-300 focus:ring-2 focus:ring-indigo-500 mr-2"
              />
              Yes
            </label>
            <label className="text-xl font-bold mr-2">
              <input
                type="radio"
                name="popularproduct"
                value="no"
                checked={formData.popularproduct === "no"}
                onChange={handleInputChange}
                className="w-6 h-6 accent-indigo-600 border-gray-300 focus:ring-2 focus:ring-indigo-500 mr-2"
              />
              No
            </label>
          </div>
          {/* Top Rated */}
          <div>
            <span className="block font-bold text-gray-800 text-lg mb-2">Top Rated:</span>
            <label className="text-xl font-bold mr-2">
              <input
                type="radio"
                name="topratedproduct"
                value="yes"
                checked={formData.topratedproduct === "yes"}
                onChange={handleInputChange}
                className="w-6 h-6 accent-indigo-600 border-gray-300 focus:ring-2 focus:ring-indigo-500 mr-2"
              />
              Yes
            </label>
            <label className="text-xl font-bold mr-2">
              <input
                type="radio"
                name="topratedproduct"
                value="no"
                checked={formData.topratedproduct === "no"}
                onChange={handleInputChange}
                className="w-6 h-6 accent-indigo-600 border-gray-300 focus:ring-2 focus:ring-indigo-500 mr-2"
              />
              No
            </label>
          </div>
          {/* Product Offer */}
          <div>
            <span className="block font-bold text-gray-800 text-lg mb-2">Product Offer:</span>
            <label className="text-xl font-bold mr-2">
              <input
                type="radio"
                name="productoffer"
                value="yes"
                checked={formData.productoffer === "yes"}
                onChange={handleInputChange}
                className="w-6 h-6 accent-indigo-600 border-gray-300 focus:ring-2 focus:ring-indigo-500 mr-2"
              />
              Yes
            </label>
            <label className="text-xl font-bold mr-2">
              <input
                type="radio"
                name="productoffer"
                value="no"
                checked={formData.productoffer === "no"}
                onChange={handleInputChange}
                className="w-6 h-6 accent-indigo-600 border-gray-300 focus:ring-2 focus:ring-indigo-500 mr-2"
              />
              No
            </label>
          </div>
        </div>

        {/* Product Description field */}
        {/*
        <div className="mt-8">
          <label
            htmlFor="productdescription"
            className="block text-base font-semibold mb-2 text-gray-700"
          >
            Product Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="productdescription"
            name="productdescription"
            required
            value={formData.productdescription || ""}
            onChange={handleInputChange}
            rows={4}
            className="input w-full h-24 px-2 py-1 text-sm rounded-md border border-gray6 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
          />
        </div>
        */}

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
