"use client";

import React, { useMemo, useState, useCallback } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import { useRouter } from "next/navigation";
import { Edit3, Trash2, Eye } from "lucide-react";
import Swal from "sweetalert2";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/redux/newproduct/NewProductApi";
import { IProduct } from "@/types/fabricproduct-type";
import { notifyError } from "@/utils/toast";
import { filterConfig } from "@/utils/filterconfig";
import Cookies from "js-cookie";
import Image from "next/image";

export default function ViewProductTable() {
  const router = useRouter();
  const {
    data: resp,
    isLoading,
    isFetching,
  } = useGetProductsQuery({
    page: 1,
    limit: 1000,
  });
  const [deleteProduct] = useDeleteProductMutation();
  const [filterText, setFilterText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [filters, setFilters] = useState<{ name: string; label: string; options: any[] }[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [substructureOptions, setSubstructureOptions] = useState<{ _id: string; name: string }[]>([]);
  const [subfinishOptions, setSubfinishOptions] = useState<{ _id: string; name: string }[]>([]);
  const [subsuitableforOptions, setSubsuitableforOptions] = useState<{ _id: string; name: string }[]>([]);

  // Fetch filter options on mount
  React.useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!BASE_URL) return;
    (async () => {
      setIsLoadingFilters(true);
      // Extract token as before
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
          filterConfig.map(f =>
            fetch(BASE_URL + f.api, { headers: { Authorization: `Bearer ${token}` } })
              .then(r => r.json())
              .then(j => j.data || [])
          )
        );
        setFilters(
          filterConfig.map((f, i) => ({
            name: f.name,
            label: f.label,
            options: results[i],
          }))
        );
      } catch {
        // handle errors if needed
      } finally {
        setIsLoadingFilters(false);
      }
    })();
  }, []);

  // Filtered products
  const filtered = useMemo(() => {
    const products = resp?.data || [];
    const lower = filterText.toLowerCase();
    return products.filter((p) =>
      [
        p.name,
        p.sku,
        p.productIdentifier,
        p.locationCode,
        p.newCategoryId,
      ].some((field) => (field || "").toLowerCase().includes(lower)),
    );
  }, [resp?.data, filterText]);

  // Delete handler
  const handleDelete = useCallback(
    (product: IProduct) => {
      Swal.fire({
        title: "Are you sure?",
        text: `You want to delete "${product.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (!result.isConfirmed) return;
        try {
          await deleteProduct(product._id).unwrap();
          Swal.fire(
            "Deleted!",
            `"${product.name}" has been deleted.`,
            "success",
          );
        } catch (err: any) {
          const message = err.data?.message ?? "Failed to delete product.";
          notifyError(message);
        }
      });
    },
    [deleteProduct],
  );

  // PDF export
  const exportPDF = useCallback(() => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Fabric Products", 14, 20);
    (doc as any).autoTable({
      startY: 26,
      head: [
        [
          "Name",
          "SKU",
          "Product ID",
          "Location",
          "GSM",
          "OZ",
          "CM",
          "Inch",
          "Qty",
          "Unit",
          "Purchase",
          "Sales",
          "Currency",
        ],
      ],
      body: filtered.map((p) => [
        p.name,
        p.sku,
        p.productIdentifier,
        p.locationCode,
        p.gsm,
        p.oz,
        p.cm,
        p.inch,
        p.quantity,
        p.um,
        p.purchasePrice,
        p.salesPrice,
        p.currency,
      ]),
      styles: { fontSize: 8 },
    });
    doc.save("fabric-products.pdf");
  }, [filtered]);

  // Helper to get human-readable value for filter fields
  const getFilterLabel = (field: string, value: string) => {
    const filter = filters.find(f => f.name === field);
    if (!filter) return value;
    const option = filter.options.find((o: any) => o._id === value);
    return option ? option.name : value;
  };

  // Helper to get human-readable value for sub-filter fields
  const getSubFilterLabel = (field: string, value: string) => {
    if (field === 'substructureId') {
      const found = substructureOptions.find(opt => opt._id === value);
      return found ? found.name : value;
    }
    if (field === 'subfinishId') {
      const found = subfinishOptions.find(opt => opt._id === value);
      return found ? found.name : value;
    }
    if (field === 'subsuitableforId' || field === 'subsuitableId') {
      const found = subsuitableforOptions.find(opt => opt._id === value);
      return found ? found.name : value;
    }
    return value;
  };

  // Columns
  const columns: TableColumn<IProduct>[] = useMemo(
    () => [
      {
        name: "Image",
        selector: (r) => r.image || "—",
        cell: (row) =>
          row.image ? (
            <Image
              src={row.image}
              alt={row.name}
              width={60}
              height={60}
              style={{ objectFit: "cover", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            />
          ) : (
            <span>—</span>
          ),
        maxWidth: "110px",
        minWidth: "110px",
      },
      {
        name: "Video",
        selector: (r) => r.video || "—",
        cell: (row) =>
          row.video ? (
            <video
              src={row.video}
              controls
              style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            />
          ) : (
            <span>—</span>
          ),
        maxWidth: "120px",
        minWidth: "120px",
      },
      {
        name: "Name",
        selector: (r) => r.name,
        sortable: true,
        minWidth: "160px",
        maxWidth: "160px",
      },
      { name: "SKU", selector: (r) => r.sku || "—", minWidth: "120px", maxWidth: "120px" },
      {
        name: "Slug",
        selector: (r) => r.slug || "—",
        minWidth: "120px",
        maxWidth: "120px",
      },
      {
        name: "Location",
        selector: (r) => r.locationCode || "—",
        minWidth: "120px",
        maxWidth: "120px",
      },
      { name: "Currency", selector: (r) => r.currency, minWidth: "100px", maxWidth: "100px" },
      { name: "Sales Price", selector: (r) => r.salesPrice || "—", minWidth: "120px", maxWidth: "120px" },
      {
        name: "Actions",
        right: true,
        minWidth: "140px",
        maxWidth: "140px",
        cell: (row) => (
          <div className="flex items-center space-x-2">
            <Eye
              className="w-5 h-5 text-gray-700 hover:text-blue-600 cursor-pointer"
              onClick={() => {
                setSelectedProduct(row);
                setModalOpen(true);
              }}
            />
            <Edit3
              className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => router.push(`/fabric-products/edit/${row._id}`)}
            />
            <Trash2
              className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
              onClick={() => handleDelete(row)}
            />
          </div>
        ),
      },
    ],
    [handleDelete, router],
  );

  // Sub-header with search & export controls
  const subHeaderComponent = useMemo(
    () => (
      <div className="flex flex-wrap items-center space-x-2 mb-2">
        <input
          type="text"
          placeholder="Search by name, SKU, Slug, Location…"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border rounded px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          onClick={() => setFilterText("")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition shadow-sm"
        >
          Clear
        </button>
        <CSVLink
          data={filtered}
          filename="fabric-products.csv"
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition shadow-sm"
        >
          Export CSV
        </CSVLink>
        <button
          onClick={exportPDF}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition shadow-sm"
        >
          Export PDF
        </button>
      </div>
    ),
    [filterText, filtered, exportPDF],
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-4">
        All Fabric Products
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <DataTable
          columns={columns}
          data={filtered}
          progressPending={isLoading || isFetching}
          pagination
          highlightOnHover
          pointerOnHover
          subHeader
          subHeaderComponent={subHeaderComponent}
          persistTableHead
          responsive={false}
          customStyles={{
            table: { style: { minWidth: "1100px", borderRadius: "12px", overflow: "hidden" } },
            headRow: { style: { background: "#2563EB", color: "white", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" } },
            headCells: { style: { fontSize: "15px", fontWeight: 700, letterSpacing: "0.5px" } },
            rows: { style: { fontSize: "14px", borderBottom: "1px solid #f1f5f9", transition: "background 0.2s", borderRadius: "8px" } },
          }}
        />
      </div>

      {/* Modal for viewing product details */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-0 relative overflow-y-auto max-h-[90vh] flex flex-col md:flex-row">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold z-10"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>
            {/* Left: Images & Video */}
            <div className="md:w-1/2 w-full bg-gray-50 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none p-6 flex flex-col items-center gap-4 border-b md:border-b-0 md:border-r border-gray-200">
              <h4 className="text-lg font-semibold mb-2 text-blue-700">Media</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {[selectedProduct.image, selectedProduct.image1, selectedProduct.image2].map(
                  (img, idx) =>
                    img ? (
                      <Image
                        key={idx}
                        src={img}
                        alt={`Product image ${idx + 1}`}
                        width={112}
                        height={112}
                        className="w-28 h-28 object-cover rounded border border-gray-200"
                      />
                    ) : null
                )}
              </div>
              {selectedProduct.video ? (
                <video
                  src={selectedProduct.video}
                  controls
                  className="w-48 h-32 object-cover rounded-lg shadow border border-gray-200 mt-2"
                />
              ) : (
                <div className="w-48 h-32 flex items-center justify-center bg-gray-200 rounded-lg text-gray-400 border">No Video</div>
              )}
            </div>
            {/* Right: Details */}
            <div className="md:w-1/2 w-full p-6 overflow-y-auto">
              <h3 className="text-2xl font-bold mb-4 text-center text-blue-800">Product Details</h3>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(selectedProduct)
                  .filter(([key]) => !['image', 'image1', 'image2', 'video', '__v', '_id'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 border-b pb-2 last:border-b-0">
                      <span className="font-semibold text-gray-700 md:w-40 capitalize text-base">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-gray-900 break-all text-base font-mono">
                        {/* Show filter label if field is a filter */}
                        {filters.some(f => f.name === key)
                          ? getFilterLabel(key, value as string)
                          : ['substructureId', 'subfinishId', 'subsuitableforId', 'subsuitableId'].includes(key)
                            ? getSubFilterLabel(key, value as string)
                            : typeof value === 'string' || typeof value === 'number'
                              ? value
                              : JSON.stringify(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
