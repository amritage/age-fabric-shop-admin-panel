"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IVendor } from "@/types/vendor-type";
import {
  useGetAllVendorsQuery,
  useDeleteVendorMutation,
} from "@/redux/vendor/vendorApi";

export default function VendorTable() {
  const { data, isLoading, isError } = useGetAllVendorsQuery();
  const [deleteVendor] = useDeleteVendorMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading vendors</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Vendor List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Image</th>
            <th className="py-2">Name</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!data || !data.data || data.data.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                No vendors found.
              </td>
            </tr>
          ) : (
            data?.data?.map((v: IVendor) => (
              <tr key={v._id}>
                <td className="py-2">
                  {v.img && (
                    <Image
                      src={v.img}
                      alt={v.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="py-2">{v.name}</td>
                <td className="py-2 flex space-x-2">
                  <Link href={`/vendor/${v._id}`}>
                    <button className="tp-btn px-3 py-1 bg-green-500 text-white rounded">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => deleteVendor(v._id!)}
                    className="tp-btn px-3 py-1 bg-red-500 text-white rounded"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
