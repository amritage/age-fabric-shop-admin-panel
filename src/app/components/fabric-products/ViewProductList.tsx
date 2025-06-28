"use client";

import React, { useMemo, useState, useCallback } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CSVLink } from "react-csv";
import { useRouter } from "next/navigation";
import { Edit3, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/redux/newproduct/NewProductApi";
import { IProduct } from "@/types/fabricproduct-type";
import { notifyError } from "@/utils/toast";

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

  // Columns
  const columns: TableColumn<IProduct>[] = useMemo(
    () => [
      {
        name: "Name",
        selector: (r) => r.name,
        sortable: true,
        minWidth: "150px",
      },
      { name: "SKU", selector: (r) => r.sku || "—", maxWidth: "80px" },
      {
        name: "Product ID",
        selector: (r) => r.productIdentifier || "—",
        maxWidth: "100px",
      },
      {
        name: "Location",
        selector: (r) => r.locationCode || "—",
        maxWidth: "80px",
      },
      { name: "GSM", selector: (r) => r.gsm, maxWidth: "60px" },
      { name: "OZ", selector: (r) => r.oz, maxWidth: "60px" },
      { name: "CM", selector: (r) => r.cm, maxWidth: "60px" },
      { name: "Inch", selector: (r) => r.inch, maxWidth: "70px" },
      { name: "Qty", selector: (r) => r.quantity, maxWidth: "60px" },
      { name: "Unit", selector: (r) => r.um, maxWidth: "80px" },
      { name: "Purchase", selector: (r) => r.purchasePrice, maxWidth: "80px" },
      { name: "Sales", selector: (r) => r.salesPrice, maxWidth: "80px" },
      { name: "Currency", selector: (r) => r.currency, maxWidth: "80px" },
      {
        name: "Actions",
        right: true,
        minWidth: "100px",
        cell: (row) => (
          <div className="flex items-center space-x-2">
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
      <div className="flex flex-wrap items-center space-x-2">
        <input
          type="text"
          placeholder="Search by name, SKU, Product ID, Location…"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border rounded px-3 py-1 w-64"
        />
        <button
          onClick={() => setFilterText("")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Clear
        </button>
        <CSVLink
          data={filtered}
          filename="fabric-products.csv"
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Export CSV
        </CSVLink>
        <button
          onClick={exportPDF}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
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

      <div className="overflow-x-auto">
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
            table: { style: { minWidth: "1400px" } },
            headRow: { style: { background: "#2563EB", color: "white" } },
            headCells: { style: { fontSize: "14px", fontWeight: 600 } },
          }}
        />
      </div>
    </div>
  );
}
