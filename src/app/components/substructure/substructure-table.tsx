"use client";
import React from "react";
import { ISubstructure } from "@/types/substructure-type";
import {
  useGetAllSubstructuresQuery,
  useDeleteSubstructureMutation,
} from "@/redux/substructure/substructureApi";
import SubstructureEditDelete from "./edit-delete-substructure";

export default function SubstructureTable() {
  const { data, isLoading, isError } = useGetAllSubstructuresQuery();
  const [deleteSub] = useDeleteSubstructureMutation();

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return <div className="text-red-500">Error loading substructures</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Substructure List</h2>
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
                No substructures found.
              </td>
            </tr>
          ) : (
            data.data.map((s: ISubstructure) => (
              <tr key={s._id}>
                <td className="py-2">{s.name}</td>
                <td className="py-2">
                  {s.structureId == null
                    ? "—"
                    : typeof s.structureId === "object"
                      ? (s.structureId as any).name
                      : s.structureId}
                </td>
                <td className="py-2">
                  <SubstructureEditDelete
                    id={s._id}
                    onDelete={() => deleteSub(s._id!)}
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
