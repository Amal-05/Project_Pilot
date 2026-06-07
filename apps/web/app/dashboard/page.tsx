"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useOrganizationStore } from "@/store/organization.store";
import { Plus, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { organizations, fetchOrganizations, createOrganization, isLoading } = useOrganizationStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrgData, setNewOrgData] = useState({ name: "", slug: "", description: "" });

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrganization(newOrgData);
      setIsModalOpen(false);
      setNewOrgData({ name: "", slug: "", description: "" });
    } catch (error) {
      console.error("Failed to create organization", error);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">My Organizations</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Organization
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <div key={org.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <Link href={`/organizations/${org.slug}`} className="text-gray-400 hover:text-blue-600">
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{org.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{org.description || "No description provided."}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Slug: {org.slug}</span>
                </div>
              </div>
            ))}
            {organizations.length === 0 && (
              <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No organizations found. Create one to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Create Org Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-6">Create New Organization</h3>
              <form onSubmit={handleCreateOrg} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newOrgData.name}
                    onChange={(e) => setNewOrgData({ ...newOrgData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL friendly)</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newOrgData.slug}
                    onChange={(e) => setNewOrgData({ ...newOrgData, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    value={newOrgData.description}
                    onChange={(e) => setNewOrgData({ ...newOrgData, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
