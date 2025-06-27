// File: app/components/fabric-products/MetadataForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearProductMedia } from '@/redux/features/productImageSlice';

// Grab your base API URL from NEXT_PUBLIC_ env
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface MetadataFormProps {
  /** Prefill values when editing; otherwise leave empty for "Add" */
  initial?: {
    charset?: string;
    xUaCompatible?: string;
    viewport?: string;
    title?: string;
    description?: string;
    keywords?: string;
    robots?: string;
    contentLanguage?: string;
    googleSiteVerification?: string;
    msValidate?: string;
    themeColor?: string;
    mobileWebAppCapable?: boolean;
    appleStatusBarStyle?: string;
    formatDetection?: string;
    ogLocale?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogType?: string;
    ogUrl?: string;
    ogSiteName?: string;
    twitterCard?: string;
    twitterSite?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    hreflang?: string;
    x_default?: string;
    author_name?: string;
    purchasePrice?: number;
    salesPrice?: number;
    locationCode?: string;
    productIdentifier?: string;
    name?: string;
  };
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onBack: () => void;
}

export default function MetadataForm({ initial = {}, onSubmit, onBack }: MetadataFormProps) {
  const [meta, setMeta] = useState<Record<string, any>>({
    // Preserve all base product data from initial
    ...initial,
    
    // Set defaults for metadata fields if not provided
    charset: initial.charset || "UTF-8",
    xUaCompatible: initial.xUaCompatible || "IE=edge",
    viewport: initial.viewport || "width=device-width, initial-scale=1.0",
    title: initial.title || initial.name || "",
    description: initial.description || "",
    keywords: initial.keywords || "",
    robots: initial.robots || "index, follow",
    contentLanguage: initial.contentLanguage || "en",
    googleSiteVerification: initial.googleSiteVerification || "",
    msValidate: initial.msValidate || "",
    themeColor: initial.themeColor || "#ffffff",
    mobileWebAppCapable: initial.mobileWebAppCapable ?? true,
    appleStatusBarStyle: initial.appleStatusBarStyle || "default",
    formatDetection: initial.formatDetection || "telephone=no",
    ogLocale: initial.ogLocale || "en_US",
    ogTitle: initial.ogTitle || initial.name || "",
    ogDescription: initial.ogDescription || "",
    ogType: initial.ogType || "product",
    ogUrl: initial.ogUrl || "",
    ogSiteName: initial.ogSiteName || "",
    twitterCard: initial.twitterCard || "summary_large_image",
    twitterSite: initial.twitterSite || "",
    twitterTitle: initial.twitterTitle || "",
    twitterDescription: initial.twitterDescription || "",
    hreflang: initial.hreflang || "",
    x_default: initial.x_default || "",
    author_name: initial.author_name || "",
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const { image, image1, image2, video } = useSelector((state: any) => state.productMedia);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setMeta((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meta.name || meta.name.trim() === "") {
      alert("Product name is required.");
      return;
    }

    // Validate required fields
    const requiredFields = [
      'name', 'sku', 'slug', 'newCategoryId', 'structureId', 'contentId',
      'gsm', 'oz', 'cm', 'inch', 'quantity', 'um', 'currency', 'finishId',
      'designId', 'colorId', 'css', 'motifsizeId', 'suitableforId', 'vendorId',
      'groupcodeId', 'purchasePrice', 'salesPrice', 'locationCode', 'productIdentifier',
      'title', 'description', 'keywords', 'ogTitle', 'ogDescription', 'ogUrl'
    ];
    
    const missingFields = requiredFields.filter(field => !meta[field]);
    if (missingFields.length > 0) {
      alert(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Call the parent onSubmit function
    await onSubmit(meta);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 max-w-4xl mx-auto space-y-8 rounded-xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 tracking-tight">Product Metadata</h2>
      {/* Product Name (required) */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Product Name<span className="text-red-500">*</span></label>
        <input
          type="text"
          name="name"
          required
          value={meta.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Charset */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Charset</label>
          <select
            name="charset"
            value={meta.charset}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          >
            <option>UTF-8</option>
          </select>
        </div>
        {/* X-UA-Compatible */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">X-UA-Compatible</label>
          <input
            type="text"
            name="xUaCompatible"
            value={meta.xUaCompatible}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        {/* Viewport */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Viewport</label>
          <input
            type="text"
            name="viewport"
            value={meta.viewport}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
          <input
            type="text"
            name="title"
            maxLength={60}
            value={meta.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
      </div>
      {/* Description & Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            maxLength={160}
            rows={2}
            value={meta.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Keywords</label>
          <input
            type="text"
            name="keywords"
            value={meta.keywords}
            onChange={handleChange}
            placeholder="comma-separated"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
      </div>
      {/* Robots, Content Language, Google Site Verification, msValidate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Robots</label>
          <select
            name="robots"
            value={meta.robots}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          >
            {["index, follow", "noindex, nofollow", "index, nofollow", "noindex, follow"].map(
              (r) => (
                <option key={r}>{r}</option>
              )
            )}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Content Language</label>
          <input
            type="text"
            name="contentLanguage"
            maxLength={10}
            value={meta.contentLanguage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Google Site Verification</label>
          <input
            type="text"
            name="googleSiteVerification"
            value={meta.googleSiteVerification}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">msValidate</label>
          <input
            type="text"
            name="msValidate"
            value={meta.msValidate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
      </div>
      {/* Theme Color, Mobile Web App Capable, Apple Status Bar Style, Format Detection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Theme Color</label>
          <input
            type="color"
            name="themeColor"
            value={meta.themeColor}
            onChange={handleChange}
            className="h-10 w-20 border border-gray-300 rounded-md bg-white"
          />
        </div>
        <div className="flex items-center space-x-2 mt-6">
          <input
            type="checkbox"
            name="mobileWebAppCapable"
            checked={meta.mobileWebAppCapable}
            onChange={handleChange}
            className="accent-indigo-500"
          />
          <label className="text-xs font-medium text-gray-600">Mobile Web App Capable</label>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Apple Status Bar Style</label>
          <select
            name="appleStatusBarStyle"
            value={meta.appleStatusBarStyle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          >
            {["default", "black", "black-translucent"].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Format Detection</label>
          <select
            name="formatDetection"
            value={meta.formatDetection}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          >
            {["telephone=no", "telephone=yes"].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      {/* OpenGraph & Twitter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OG Locale</label>
          <input
            type="text"
            name="ogLocale"
            maxLength={10}
            value={meta.ogLocale}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OG Title</label>
          <input
            type="text"
            name="ogTitle"
            maxLength={60}
            value={meta.ogTitle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OG Description</label>
          <input
            type="text"
            name="ogDescription"
            maxLength={160}
            value={meta.ogDescription}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OG Type</label>
          <input
            type="text"
            name="ogType"
            value={meta.ogType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OG URL</label>
          <input
            type="text"
            name="ogUrl"
            maxLength={2048}
            value={meta.ogUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">OG Site Name</label>
          <input
            type="text"
            name="ogSiteName"
            maxLength={100}
            value={meta.ogSiteName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Twitter Card</label>
          <select
            name="twitterCard"
            value={meta.twitterCard}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          >
            {["summary", "summary_large_image", "app", "player"].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Twitter Site</label>
          <input
            type="text"
            name="twitterSite"
            maxLength={25}
            value={meta.twitterSite}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Twitter Title</label>
          <input
            type="text"
            name="twitterTitle"
            maxLength={60}
            value={meta.twitterTitle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Twitter Description</label>
          <input
            type="text"
            name="twitterDescription"
            maxLength={160}
            value={meta.twitterDescription}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
      </div>
      {/* hreflang, x_default, Author Name */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">hreflang</label>
          <input
            type="text"
            name="hreflang"
            maxLength={10}
            value={meta.hreflang}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">x_default</label>
          <input
            type="text"
            name="x_default"
            maxLength={10}
            value={meta.x_default}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Author Name</label>
          <input
            type="text"
            name="author_name"
            maxLength={100}
            value={meta.author_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
      </div>
      {/* Pricing & codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Purchase Price</label>
          <input
            type="number"
            name="purchasePrice"
            value={meta.purchasePrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Sales Price</label>
          <input
            type="number"
            name="salesPrice"
            value={meta.salesPrice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Location Code</label>
          <input
            type="text"
            name="locationCode"
            value={meta.locationCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Product Identifier</label>
          <input
            type="text"
            name="productIdentifier"
            value={meta.productIdentifier}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 text-sm bg-white"
          />
        </div>
      </div>
      {/* Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition"
        >
          ← Previous
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition"
        >
          Submit Product
        </button>
      </div>
    </form>
  );
}
