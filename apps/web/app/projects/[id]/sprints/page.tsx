"use client";

import { useEffect, useState, use } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSprintStore } from "@/store/sprint.store";
import { useProjectStore } from "@/store/project.store";
import { useTaskStore } from "@/store/task.store";
import { Plus, Calendar, Target, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SprintsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { projects } = useProjectStore();
  const { sprints, fetchSprints, createSprint, startSprint, completeSprint, isLoading } = useSprintStore();
  const { tasks, fetchTasks } = useTaskStore();
  
  const [project, setProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSprintData, setNewSprintData] = useState({ 
    name: "", 
    goal: "", 
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    projectId: id 
  });

  useEffect(() => {
    const foundProject = projects.find(p => p.id === id);
    if (foundProject) setProject(foundProject);
    fetchSprints(id);
    fetchTasks(id);
  }, [id, projects, fetchSprints, fetchTasks]);

  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault();
    await createSprint(newSprintData);
    setIsModalOpen(false);
    setNewSprintData({ ...newSprintData, name: "", goal: "" });
  };

  if (!project) return null;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link href={`/projects/${id}`} className="hover:text-blue-600">{project.name}</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-800 font-medium">Sprints</span>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Sprint Management</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Plan Sprint
          </button>
        </div>

        <div className="space-y-6">
          {sprints.map((sprint) => (
            <div key={sprint.id} className={`bg-white border rounded-2xl overflow-hidden shadow-sm ${sprint.isActive ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-gray-800">{sprint.name}</h3>
                      {sprint.isActive && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Active</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{sprint.goal || "No goal defined for this sprint."}</p>
                  </div>
                  <div className="flex space-x-3">
                    {!sprint.isActive ? (
                      <button 
                        onClick={() => startSprint(sprint.id)}
                        className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-bold"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Sprint
                      </button>
                    ) : (
                      <button 
                        onClick={() => completeSprint(sprint.id)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Complete Sprint
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 pt-4 border-t border-gray-50">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Duration</p>
                      <p className="text-sm font-medium">{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Task Count</p>
                      <p className="text-sm font-medium">{sprint._count?.tasks || 0} Tasks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {sprints.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No sprints planned. Start planning your first sprint!</p>
            </div>
          )}
        </div>

        {/* Create Sprint Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Plan New Sprint</h3>
              <form onSubmit={handleCreateSprint} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sprint Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={newSprintData.name}
                    onChange={(e) => setNewSprintData({ ...newSprintData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    value={newSprintData.goal}
                    onChange={(e) => setNewSprintData({ ...newSprintData, goal: e.target.value })}
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      value={newSprintData.startDate.split('T')[0]}
                      onChange={(e) => setNewSprintData({ ...newSprintData, startDate: new Date(e.target.value).toISOString() })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      value={newSprintData.endDate.split('T')[0]}
                      onChange={(e) => setNewSprintData({ ...newSprintData, endDate: new Date(e.target.value).toISOString() })}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-100">Plan Sprint</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
