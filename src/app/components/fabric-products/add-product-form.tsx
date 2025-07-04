/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetProductByIdQuery,
  useGetProductsByGroupCodeQuery,
} from "@/redux/newproduct/NewProductApi";
import { filterConfig, subFilterConfig } from "@/utils/filterconfig";
import { useDispatch } from "react-redux";
import { setProductMedia } from "@/redux/features/productImageSlice";
import { notifyError } from "@/utils/toast";
import Image from "next/image";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Related Products Component
const RelatedProducts = ({ groupcodeId }: { groupcodeId: string }) => {
  const { data: response, isLoading, error } =
    useGetProductsByGroupCodeQuery(groupcodeId, { skip: !groupcodeId });
  const relatedProducts = response?.data || [];

  if (!groupcodeId) return null;
  if (isLoading)
    return <div className="text-sm text-gray-500">Loading related products...</div>;
  if (error)
    return <div className="text-sm text-red-500">Error loading related products</div>;
  if (relatedProducts.length === 0)
    return <div className="text-sm text-gray-500">No related products found.</div>;

  return (
    <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Related Products ({relatedProducts.length})
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
        {relatedProducts.slice(0, 6).map((p) => (
          <div key={p._id} className="bg-white p-3 rounded border text-xs">
            <div className="font-medium text-gray-800 truncate">{p.name}</div>
            <div className="text-gray-600">SKU: {p.sku}</div>
            <div className="text-gray-600">
              Price: {p.salesPrice} {p.currency}
            </div>
            <div className="text-gray-600">GSM: {p.gsm} | OZ: {p.oz}</div>
          </div>
        ))}
      </div>
      {relatedProducts.length > 6 && (
        <div className="text-xs text-gray-500 mt-2">
          Showing 6 of {relatedProducts.length}
        </div>
      )}
    </div>
  );
};

export default function AddProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = productId ?? searchParams.get("editId") ?? undefined;
  const isEdit = Boolean(editId);

  // Fetch existing product when editing
  const { data: productDetail, isLoading: loadingDetail } =
    useGetProductByIdQuery(editId!, { skip: !isEdit });

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [filters, setFilters] = useState<{
    name: string;
    label: string;
    options: any[];
  }[]>(
    [
      ...filterConfig.map((f) => ({ name: f.name, label: f.label, options: [] })),
      ...subFilterConfig.map((f) => ({ name: f.name, label: f.name, options: [] })),
    ]
  );
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [filterErrors, setFilterErrors] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [restored, setRestored] = useState(false);
  const dispatch = useDispatch();

  // Restore unsaved form if adding new
  useEffect(() => {
    if (!isEdit) {
      const saved = localStorage.getItem("ADD_PRODUCT_FORM_DATA");
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
          setRestored(true);
        } catch {}
      }
    }
  }, [isEdit]);

  // Load top-level filters
  useEffect(() => {
    setLoadingFilters(true);
    const cookie = Cookies.get("admin");
    let token = "";
    if (cookie) {
      try {
        token = JSON.parse(cookie).accessToken;
      } catch {}
    }
    Promise.all(
      filterConfig.map((cfg) =>
        fetch(BASE_URL + cfg.api, { headers: { Authorization: `Bearer ${token}` } })
          .then((r) => r.json())
          .then((j) => j.data || [])
      )
    )
      .then((results) => {
        setFilters((fs) =>
          fs.map((f) => {
            const idx = filterConfig.findIndex((c) => c.name === f.name);
            return idx >= 0 ? { ...f, options: results[idx] } : f;
          })
        );
      })
      .catch((e) => console.error(e))
      .finally(() => setLoadingFilters(false));
  }, []);

  // Hydrate formData for edit
  useEffect(() => {
    if (loadingFilters || !productDetail) return;
    const data: Record<string, any> = { ...productDetail };
    const extract = (v: any) => (v && v._id ? v._id : v || "");
    [...filterConfig, ...subFilterConfig].forEach(({ name }) => {
      data[name] = extract(data[name]);
    });
    setFormData(data);
    ["image", "image1", "image2", "video"].forEach((k) => {
      if (data[k]) setPreviews((p) => ({ ...p, [k]: data[k] }));
    });
  }, [loadingFilters, productDetail]);

  // Dependent sub-filters loader
  const loadSubs = (
    parentKey: string,
    subName: string,
    api: string,
    errKey: string
  ) => {
    const val = formData[parentKey];
    if (!val) {
      setFilters((fs) => fs.map((f) => (f.name === subName ? { ...f, options: [] } : f)));
      return;
    }
    const cookie = Cookies.get("admin");
    let token = "";
    if (cookie) {
      try {
        token = JSON.parse(cookie).accessToken;
      } catch {}
    }
    fetch(BASE_URL + api, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((j) => {
        const opts = (j.data || []).filter((item: any) => item[parentKey] === val);
        setFilters((fs) =>
          fs.map((f) => (f.name === subName ? { ...f, options: opts } : f))
        );
      })
      .catch(() =>
        setFilterErrors((e) => ({ ...e, [errKey]: `Failed to load ${subName}` }))
      );
  };

  useEffect(() => loadSubs("structureId", "subStructureId", "/api/substructure/view", "subStructureId"), [
    formData.structureId,
  ]);
  useEffect(() => loadSubs("finishId", "subFinishId", "/api/subfinish/view", "subFinishId"), [
    formData.finishId,
  ]);
  useEffect(() =>
    loadSubs("suitableforId", "subSuitableId", "/api/subsuitable/view", "subSuitableId"),
    [formData.suitableforId]
  );

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type } = e.target;
    let newVal: any = value;
    if (type === "file") newVal = e.target.files[0] || null;
    const updated = { ...formData, [name]: newVal };
    setFormData(updated);
    if (!isEdit) localStorage.setItem("ADD_PRODUCT_FORM_DATA", JSON.stringify(updated));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0] || null;
    const updated = { ...formData, [field]: file };
    setFormData(updated);
    if (file) setPreviews((p) => ({ ...p, [field]: URL.createObjectURL(file) }));
    dispatch(
      setProductMedia({
        image: field === "image" ? file : formData.image,
        image1: field === "image1" ? file : formData.image1,
        image2: field === "image2" ? file : formData.image2,
        video: field === "video" ? file : formData.video,
      })
    );
    if (!isEdit) {
      const ls = { ...updated, [field]: file ? field : null };
      localStorage.setItem("ADD_PRODUCT_FORM_DATA", JSON.stringify(ls));
    }
  };

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    // validate, coerce types, etc.
    router.push(
      isEdit
        ? `/fabric-products/metadata?editId=${editId}`
        : "/fabric-products/metadata"
    );
  };

  return (
    <div className="w-full min-h-screen flex justify-center py-8">
      <form onSubmit={goNext} className="w-full max-w-7xl bg-white rounded-lg shadow p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          {isEdit ? "Edit" : "Add New"} Fabric Product
        </h1>

        {/* Loading & Errors */}
        {loadingFilters && <p>Loading filters...</p>}
        {restored && !isEdit && <p>Your data was restored</p>}
        {Object.keys(filterErrors).length > 0 && (
          <div>
            <strong>Dropdown errors:</strong>
            {Object.entries(filterErrors).map(([k, v]) => (
              <div key={k}>{v}</div>
            ))}
          </div>
        )}

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            name="name"
            placeholder="Product Name"
            value={formData.name || ""}
            onChange={handleInputChange}
            required
            className="form-input col-span-3"
          />
          <input
            name="sku"
            placeholder="SKU"
            value={formData.sku || ""}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            name="slug"
            placeholder="Slug"
            value={formData.slug || ""}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            name="productIdentifier"
            placeholder="Product Identifier"
            value={formData.productIdentifier || ""}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            name="locationCode"
            placeholder="Location Code"
            maxLength={3}
            value={formData.locationCode || ""}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            name="css"
            placeholder="CSS"
            value={formData.css || ""}
            onChange={handleInputChange}
            required
            className="form-input col-span-2"
          />

          {/* Numeric Fields */}
          <input
            name="quantity"
            placeholder="Quantity"
            type="number"
            value={formData.quantity || ""}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            name="purchasePrice"
            placeholder="Purchase Price"
            type="number"
            value={formData.purchasePrice || ""}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            name="salesPrice"
            placeholder="Sales Price"
            type="number"
            value={formData.salesPrice || ""}
            onChange={handleInputChange}
            required
            className="form-input"
          />

          {/* Unit & Currency */}
          <select
            name="um"
            value={formData.um || ""}
            onChange={handleInputChange}
            required
            className="form-input"
          >
            <option value="">Unit</option>
            <option value="meter">Meter</option>
            <option value="yard">Yard</option>
            <option value="kgs">Kgs</option>
          </select>
          <select
            name="currency"
            value={formData.currency || ""}
            onChange={handleInputChange}
            required
            className="form-input"
          >
            <option value="">Currency</option>
            <option>INR</option>
            <option>USD</option>
          </select>

          {/* Conversions */}
          <input
            readOnly
            value={formData.oz || ""}
            placeholder="OZ"
            className="form-input bg-gray-100"
          />
          <input
            readOnly
            value={formData.inch || ""}
            placeholder="Inch"
            className="form-input bg-gray-100"
          />
        </div>

        {/* Dynamic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filters.map((f) => (
            <div key={f.name}>
              <label className="block font-medium mb-1">{f.label}</label>
              <select
                name={f.name}
                value={formData[f.name] || ""}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="">Select {f.label}</option>
                {f.options.map((o: any) => (
                  <option key={o._id} value={o._id}>”{o.name}”</option>
                ))}
              </select>
              {f.name === "groupcodeId" && formData.groupcodeId && (
                <RelatedProducts groupcodeId={formData.groupcodeId} />
              )}
            </div>
          ))}
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["image", "image1", "image2", "video"].map((key) => (
            <div key={key}>
              <label className="block font-medium mb-1">{key}</label>
              <input
                type="file"
                accept={key === "video" ? "video/*" : "image/*"}
                onChange={(e) => handleFileChange(e, key)}
                className="form-input"
              />
              {previews[key] &&
                (key === "video" ? (
                  <video
                    src={previews[key]}
                    controls
                    className="mt-2 w-full h-32 rounded border"
                  />
                ) : (
                  <Image
                    src={previews[key]}
                    alt={key}
                    width={320}
                    height={128}
                    className="mt-2 object-cover rounded border"
                    unoptimized
                  />
                ))}
            </div>
          ))}
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-4">
          {['popularproduct','topratedproduct','productoffer'].map((flag) => (
            <div key={flag} className="flex items-center">
              <span className="mr-2 font-medium">{flag}:</span>
              {['yes','no'].map((val) => (
                <label key={val} className="mr-4">
                  <input
                    type="radio"
                    name={flag}
                    value={val}
                    checked={formData[flag] === val}
                    onChange={handleInputChange}
                  />{' '}{val}
                </label>
              ))}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          {!isEdit && (
            <button
              type="button"
              onClick={() => { setFormData({}); localStorage.removeItem("ADD_PRODUCT_FORM_DATA"); }}
              className="px-6 py-2 bg-gray-200 rounded"
            >
              Clear Form
            </button>
          )}
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded">
            Next → Metadata
          </button>
        </div>
      </form>
    </div>
  );
}
