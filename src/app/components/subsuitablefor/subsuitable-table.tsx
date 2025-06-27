"use client";
import React from "react";
import { ISubSuitableFor } from "@/types/subsuitable-type";
import {
  useGetAllSubSuitableForQuery,
  useDeleteSubSuitableForMutation,
} from "@/redux/subsuitablefor/subsuitableApi";
import SubSuitableForEditDelete from "./edit-delete-subsuitable";

export default function SubSuitableForTable() {
  const { data, isLoading, isError } = useGetAllSubSuitableForQuery();
  const [deleteSSF] = useDeleteSubSuitableForMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error loading items</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Sub-SuitableFor List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Parent</th>
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
            data.data.map((ssf: ISubSuitableFor) => (
              <tr key={ssf._id}>
                <td className="py-2">{ssf.name}</td>
                <td className="py-2">{ssf.suitableForId}</td>
                <td className="py-2">
                  <SubSuitableForEditDelete
                    id={ssf._id}
                    onDelete={() => deleteSSF(ssf._id!)}
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
