"use client";

import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useOrganizationStore } from "@/store/organization.store";
import { useProjectStore } from "@/store/project.store";
import { Briefcase, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AllProjectsPage() {
  const { organizations, fetchOrganizations } = useOrganizationStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  // This is a simplified view. In a real app, you might have a dedicated API to list all projects across orgs.
  // For now, we'll fetch projects for the organizations we find.
  useEffect(() => {
    organizations.forEach(org => {
      fetchProjects(org.id);
    });
  }, [organizations, fetchProjects]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">All Projects</h2>
          <p className="text-gray-500">View all projects you're working on across organizations.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project) => {
                const org = organizations.find(o => o.id === project.organizationId);
                return (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="font-medium text-gray-800">{project.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="w-4 h-4 mr-2" />
                        {org?.name || 'Loading...'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${
                        project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-end">
                        View Board
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
