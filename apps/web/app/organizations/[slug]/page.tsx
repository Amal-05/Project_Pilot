"use client";

import { useEffect, useState, use } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useOrganizationStore } from "@/store/organization.store";
import { useProjectStore } from "@/store/project.store";
import { useAuthStore } from "@/store/auth.store";
import { Plus, Briefcase, Calendar, Target, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function OrganizationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { organizations, fetchOrganizations, setCurrentOrganization, currentOrganization } = useOrganizationStore();
  const { user } = useAuthStore();
  const { projects, fetchProjects, createProject, isLoading: isProjectsLoading } = useProjectStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ 
    name: "", 
    description: "", 
    status: "PLANNING",
    organizationId: "" 
  });

  useEffect(() => {
    if (organizations.length === 0) {
      fetchOrganizations();
    }
  }, [fetchOrganizations, organizations.length]);

  useEffect(() => {
    const org = organizations.find(o => o.slug === slug);
    if (org) {
      setCurrentOrganization(org);
      fetchProjects(org.id);
      setNewProjectData(prev => ({ ...prev, organizationId: org.id }));
    }
  }, [slug, organizations, setCurrentOrganization, fetchProjects]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) return;
      await createProject({
        ...newProjectData,
        managerId: user.id
      });
      setIsModalOpen(false);
      setNewProjectData({ ...newProjectData, name: "", description: "" });
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  if (!currentOrganization) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{currentOrganization.name}</h2>
            <p className="text-gray-500 mt-1">{currentOrganization.description}</p>
          </div>
          <div className="flex space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg">
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Projects</p>
              <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center">
            <div className="p-3 bg-green-50 rounded-lg mr-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Sprints Active</p>
              <p className="text-2xl font-bold text-gray-800">0</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg mr-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-800">0%</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-6">Projects</h3>

        {isProjectsLoading ? (
          <div className="flex justify-center items-center h-48">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      project.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{project.name}</h4>
                  <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                </div>
              </Link>
            ))}
            {projects.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">No projects yet. Start by creating one!</p>
              </div>
            )}
          </div>
        )}

        {/* Create Project Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-6">Create New Project</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newProjectData.name}
                    onChange={(e) => setNewProjectData({ ...newProjectData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    value={newProjectData.description}
                    onChange={(e) => setNewProjectData({ ...newProjectData, description: e.target.value })}
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
                    Create Project
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
