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
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
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
  const dispatch = useDispatch();

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

      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
             /*  console.error(`Error loading ${f.label}:`, error); */
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
       /*  console.error("Error loading filters:", error); */
      } finally {
        setIsLoadingFilters(false);
      }
    })();
  }, []);

  // when productDetail arrives, seed form + previews
  useEffect(() => {
    if (!productDetail) return;
    setFormData(productDetail);

    ["image", "image1", "image2", "video"].forEach((key) => {
      const url = (productDetail as any)[key];
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
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((p) => ({ ...p, [field]: file }));
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

    // Do NOT store images in localStorage
    // Only store non-file fields if needed
    const cleanedFormData = { ...formData };
    // Map isPopular to popularproduct for backend
    cleanedFormData.popularproduct = formData.isPopular === true ? "yes" : "no";
    delete cleanedFormData.isPopular;
    ["image", "image1", "image2", "video"].forEach((key) => {
      delete cleanedFormData[key];
    });
    localStorage.setItem("NEW_PRODUCT_BASE", JSON.stringify(cleanedFormData));
    router.push(
      isEdit
        ? `/fabric-products/metadata?editId=${editId}`
        : `/fabric-products/metadata`,
    );
  };

  return (
    <form
      onSubmit={goNext}
      className="bg-white p-6 my-8 border border-gray-200 rounded-xl max-w-4xl mx-auto space-y-8"
    >
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-4 tracking-tight">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            value={formData.name || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* SKU */}
        <div>
          <label
            htmlFor="sku"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            id="sku"
            name="sku"
            required
            value={formData.sku || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            name="slug"
            required
            value={formData.slug || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Product Identifier */}
        <div>
          <label
            htmlFor="productIdentifier"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            Product Identifier <span className="text-red-500">*</span>
          </label>
          <input
            id="productIdentifier"
            name="productIdentifier"
            required
            value={formData.productIdentifier || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Location Code */}
        <div>
          <label
            htmlFor="locationCode"
            className="block text-xs font-medium mb-1 text-gray-600"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* CSS */}
        <div>
          <label
            htmlFor="css"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            CSS <span className="text-red-500">*</span>
          </label>
          <input
            id="css"
            name="css"
            required
            value={formData.css || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-xs font-medium mb-1 text-gray-600"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Unit */}
        <div>
          <label
            htmlFor="um"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            Unit (UM) <span className="text-red-500">*</span>
          </label>
          <select
            id="um"
            name="um"
            required
            value={formData.um || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
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
            className="block text-xs font-medium mb-1 text-gray-600"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Sales Price */}
        <div>
          <label
            htmlFor="salesPrice"
            className="block text-xs font-medium mb-1 text-gray-600"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Currency */}
        <div>
          <label
            htmlFor="currency"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            Currency <span className="text-red-500">*</span>
          </label>
          <select
            id="currency"
            name="currency"
            required
            value={formData.currency || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
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
            className="block text-xs font-medium mb-1 text-gray-600"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label
            htmlFor="oz"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            OZ <span className="text-red-500">*</span>
          </label>
          <input
            id="oz"
            name="oz"
            readOnly
            required
            value={formData.oz || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Width CM → Inch */}
        <div>
          <label
            htmlFor="cm"
            className="block text-xs font-medium mb-1 text-gray-600"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label
            htmlFor="inch"
            className="block text-xs font-medium mb-1 text-gray-600"
          >
            Width (Inch) <span className="text-red-500">*</span>
          </label>
          <input
            id="inch"
            name="inch"
            readOnly
            required
            value={formData.inch || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>

        {/* Dynamic filters */}
        {filters.map((f) => (
          <div key={f.name}>
            <label
              htmlFor={f.name}
              className="block text-xs font-medium mb-1 text-gray-600"
            >
              {f.label} <span className="text-red-500">*</span>
            </label>
            <select
              id={f.name}
              name={f.name}
              required
              value={formData[f.name] || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
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
          <div key={key}>
            <label className="block text-xs font-medium mb-1 text-gray-600">
              {key === "video" ? "Upload Video" : `Upload ${key}`}
            </label>
            <input
              type="file"
              name={key}
              accept={key === "video" ? "video/*" : "image/*"}
              onChange={(e) => handleFileChange(e, key)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
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
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
          <span>Popular Product:</span>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isPopularYes"
              checked={formData.isPopular === true}
              onChange={() => setFormData((p) => ({ ...p, isPopular: true }))}
              className="mr-1"
            />
            Yes
          </label>
          <label className="flex items-center ml-2">
            <input
              type="checkbox"
              name="isPopularNo"
              checked={formData.isPopular === false}
              onChange={() => setFormData((p) => ({ ...p, isPopular: false }))}
              className="mr-1"
            />
            No
          </label>
        </div>
        {/* Top Rated */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
          <span>Top Rated:</span>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isTopRatedYes"
              checked={formData.isTopRated === true}
              onChange={() => setFormData((p) => ({ ...p, isTopRated: true }))}
              className="mr-1"
            />
            Yes
          </label>
          <label className="flex items-center ml-2">
            <input
              type="checkbox"
              name="isTopRatedNo"
              checked={formData.isTopRated === false}
              onChange={() => setFormData((p) => ({ ...p, isTopRated: false }))}
              className="mr-1"
            />
            No
          </label>
        </div>
        {/* Product Offer */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
          <span>Product Offer:</span>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isProductOfferYes"
              checked={formData.isProductOffer === true}
              onChange={() =>
                setFormData((p) => ({ ...p, isProductOffer: true }))
              }
              className="mr-1"
            />
            Yes
          </label>
          <label className="flex items-center ml-2">
            <input
              type="checkbox"
              name="isProductOfferNo"
              checked={formData.isProductOffer === false}
              onChange={() =>
                setFormData((p) => ({ ...p, isProductOffer: false }))
              }
              className="mr-1"
            />
            No
          </label>
        </div>
      </div>

      {/* Product Description at the bottom */}
      <div className="mt-8">
        <label
          htmlFor="description"
          className="block text-xs font-medium mb-1 text-gray-600"
        >
          Product Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
        />
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition"
        >
          Next → Metadata
        </button>
      </div>
    </form>
  );
}
