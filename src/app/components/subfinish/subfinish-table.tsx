"use client";
import React from "react";
import { ISubFinish } from "@/types/subfinish-type";
import {
  useGetAllSubFinishQuery,
  useDeleteSubFinishMutation,
} from "@/redux/subfinish/subfinishApi";
import SubFinishEditDelete from "./edit-delete-subfinish";

export default function SubFinishTable() {
  const { data, isLoading, isError } = useGetAllSubFinishQuery();
  const [deleteSF] = useDeleteSubFinishMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading items</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Sub-Finish List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Structure</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {!data || data.data.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-gray-500 py-4">
                No items found.
              </td>
            </tr>
          ) : (
            data.data.map((sf: ISubFinish) => (
              <tr key={sf._id}>
                <td className="py-2">{sf.name}</td>
                <td className="py-2">{sf.structureId}</td>
                <td className="py-2">
                  <SubFinishEditDelete
                    id={sf._id}
                    onDelete={() => deleteSF(sf._id!)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
