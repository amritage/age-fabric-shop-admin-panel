"use client";
import React from "react";
import { useGetProductsQuery } from "@/redux/newproduct/NewProductApi";
import { filterConfig } from "@/utils/filterconfig";
import { useGetAllNewCategoriesQuery } from "@/redux/newcategory/newcategoryApi";
import { useGetAllStructuresQuery } from "@/redux/structure/structureApi";
import { useGetAllContentQuery } from "@/redux/content/contentApi";
import { useGetAllFinishQuery } from "@/redux/finish/finishApi";
import { useGetAllDesignQuery } from "@/redux/design/designApi";
import { useGetAllColorQuery } from "@/redux/color/colorApi";
import { useGetAllMotifQuery } from "@/redux/motif/motifApi";
import { useGetAllSuitableForQuery } from "@/redux/suitablefor/suitableforApi";
import { useGetAllVendorsQuery } from "@/redux/vendor/vendorApi";
import { useGetAllGroupCodesQuery } from "@/redux/group-code/group-code-api";
import { useGetAllSubstructuresQuery } from "@/redux/substructure/substructureApi";
import { useGetAllSubFinishQuery } from "@/redux/subfinish/subfinishApi";
import { useGetAllSubSuitableForQuery } from "@/redux/subsuitablefor/subsuitableApi";
import { FaBoxOpen, FaListAlt, FaCubes, FaLayerGroup, FaPalette, FaShapes, FaSwatchbook, FaUserTie, FaTags, FaUsers, FaSitemap, FaPuzzlePiece, FaRegObjectGroup } from "react-icons/fa";
import type { IconType, IconBaseProps } from "react-icons";
import { useRouter } from "next/navigation";

const filterHooks = [
  useGetAllNewCategoriesQuery,
  useGetAllStructuresQuery,
  useGetAllContentQuery,
  useGetAllFinishQuery,
  useGetAllDesignQuery,
  useGetAllColorQuery,
  useGetAllMotifQuery,
  useGetAllSuitableForQuery,
  useGetAllVendorsQuery,
  useGetAllGroupCodesQuery,
];

const filterIcons = [
  FaListAlt, // Category
  FaLayerGroup, // Structure
  FaCubes, // Content
  FaSwatchbook, // Finish
  FaShapes, // Design
  FaPalette, // Color
  FaShapes, // Motif Size
  FaTags, // Suitable For
  FaUserTie, // Vendor
  FaUsers, // Group Code
];

const filterRoutes = [
  "/newcategory",
  "/structure",
  "/content",
  "/finish",
  "/design",
  "/colors",
  "/motif",
  "/suitable-for",
  "/vendor",
  "/group-code",
];
const subFilterHooks = [
  useGetAllSubstructuresQuery,
  useGetAllSubFinishQuery,
  useGetAllSubSuitableForQuery,
];
const subFilterLabels = [
  "Sub Structure",
  "Sub Finish",
  "Sub Suitable For",
];
const subFilterIcons = [
  FaSitemap, // Sub Structure
  FaPuzzlePiece, // Sub Finish
  FaRegObjectGroup, // Sub Suitable For
];
const subFilterRoutes = [
  "/sub-structure",
  "/subfinish",
  "/subsuitablefor",
];

const filterIconGradients = [
  "from-pink-400 via-pink-500 to-pink-600",
  "from-purple-400 via-purple-500 to-purple-600",
  "from-green-400 via-green-500 to-green-600",
  "from-yellow-400 via-yellow-500 to-yellow-600",
  "from-indigo-400 via-indigo-500 to-indigo-600",
  "from-red-400 via-red-500 to-red-600",
  "from-teal-400 via-teal-500 to-teal-600",
  "from-blue-400 via-blue-500 to-blue-600",
  "from-orange-400 via-orange-500 to-orange-600",
  "from-cyan-400 via-cyan-500 to-cyan-600",
];
const subFilterIconGradients = [
  "from-fuchsia-400 via-fuchsia-500 to-fuchsia-600",
  "from-lime-400 via-lime-500 to-lime-600",
  "from-amber-400 via-amber-500 to-amber-600",
];

// Add animated gradient keyframes
const animatedGradient = `
  @keyframes animated-bg {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;
if (typeof window !== 'undefined' && !document.getElementById('animated-gradient-style')) {
  const style = document.createElement('style');
  style.id = 'animated-gradient-style';
  style.innerHTML = animatedGradient;
  document.head.appendChild(style);
}

function Card({ label, count, icon: Icon, onClick }: { label: string; count: number | string; icon?: IconType; onClick?: () => void }) {
  return (
    <div
      className="relative min-h-[160px] min-w-[200px] cursor-pointer overflow-hidden flex flex-col justify-between items-start p-6 rounded-xl border border-gray-200 bg-white hover:border-blue-400 transition-all duration-200"
      onClick={onClick}
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === 'Enter' && onClick) onClick(); }}
    >
      {/* Simple Icon */}
      <span className="text-5xl mb-4 text-blue-500">
        {Icon ? React.createElement(Icon as React.FunctionComponent<IconBaseProps>) : null}
      </span>
      {/* Count and label */}
      <div className="mt-2 flex flex-col items-start">
        <h4 className="text-4xl font-bold text-blue-900 mb-1 leading-none tracking-tight">
          {count}
        </h4>
        <p className="text-lg font-semibold text-gray-700 uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function ProductAndFilterCards() {
  const router = useRouter();
  // Products
  const { data: productsData, isLoading: loadingProducts } = useGetProductsQuery({ page: 1, limit: 10000 });
  const productCount = productsData?.data?.length ?? 0;

  // Filters
  const filterResults = filterHooks.map((hook) => hook());
  const loadingFilters = filterResults.some((r) => r.isLoading);
  const filterCounts = filterResults.map((r) => r.data?.data?.length ?? 0);

  // Sub Filters
  const subFilterResults = subFilterHooks.map((hook) => hook());
  const loadingSubFilters = subFilterResults.some((r) => r.isLoading);
  const subFilterCounts = subFilterResults.map((r) => r.data?.data?.length ?? 0);

  if (loadingProducts || loadingFilters || loadingSubFilters) {
    return <div className="text-center py-10 text-lg font-semibold text-blue-700">Loading dashboard data...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
      <Card label="Products" count={productCount} icon={FaBoxOpen} onClick={() => router.push("/fabric-products/view")} />
      {filterConfig.map((filter, idx) => (
        <Card
          key={filter.name}
          label={filter.label}
          count={filterCounts[idx]}
          icon={filterIcons[idx]}
          onClick={() => router.push(filterRoutes[idx])}
        />
      ))}
      {subFilterLabels.map((label, idx) => (
        <Card
          key={label}
          label={label}
          count={subFilterCounts[idx]}
          icon={subFilterIcons[idx]}
          onClick={() => router.push(subFilterRoutes[idx])}
        />
      ))}
    </div>
  );
} 