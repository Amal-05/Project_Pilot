"use client";

import { useEffect, useState, use } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import KanbanBoard from "@/components/KanbanBoard";
import { useProjectStore } from "@/store/project.store";
import { useTaskStore, TaskPriority, TaskStatus } from "@/store/task.store";
import { useAuthStore } from "@/store/auth.store";
import { useAiStore } from "@/store/ai.store";
import { Plus, Filter, Users, Settings as SettingsIcon, ChevronRight, Sparkles, ShieldAlert, X } from "lucide-react";
import Link from "next/link";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { projects } = useProjectStore();
  const { fetchTasks, createTask, initSocket, disconnectSocket, isLoading } = useTaskStore();
  const { user } = useAuthStore();
  const { generateTasks, analyzeRisk, isGenerating } = useAiStore();
  
  const [project, setProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [riskAnalysis, setRiskAnalysis] = useState<string | null>(null);
  const [newTaskData, setNewTaskData] = useState({ 
    title: "", 
    description: "", 
    priority: "MEDIUM" as TaskPriority,
    status: "TODO" as TaskStatus,
    projectId: id 
  });

  useEffect(() => {
    const foundProject = projects.find(p => p.id === id);
    if (foundProject) {
      setProject(foundProject);
    }
  }, [id, projects]);

  useEffect(() => {
    fetchTasks(id);
    initSocket(id);
    return () => disconnectSocket(id);
  }, [id, fetchTasks, initSocket, disconnectSocket]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(newTaskData);
      setIsModalOpen(false);
      setNewTaskData({ ...newTaskData, title: "", description: "" });
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tasks = await generateTasks(id, aiPrompt);
      for (const task of tasks) {
        await createTask({ ...task, projectId: id, status: 'TODO', priority: 'MEDIUM' });
      }
      setIsAiModalOpen(false);
      setAiPrompt("");
    } catch (error) {}
  };

  const handleAnalyzeRisk = async () => {
    try {
      const analysis = await analyzeRisk(id);
      setRiskAnalysis(analysis);
    } catch (error) {}
  };

  if (!project) {
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
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-blue-600">Organizations</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-800 font-medium">{project.name}</span>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{project.name}</h2>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex -space-x-2">
                 <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
              </div>
              <span className="text-gray-400">|</span>
              <div className="flex items-center text-gray-500 text-sm">
                <Users className="w-4 h-4 mr-1" />
                <span>1 Member</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center px-4 py-2 bg-purple-50 text-purple-600 border border-purple-100 rounded-lg hover:bg-purple-100 transition-colors font-medium shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Generate
            </button>
            <button 
              onClick={handleAnalyzeRisk}
              className="flex items-center px-4 py-2 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg hover:bg-orange-100 transition-colors font-medium shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 mr-2" />
              Risk Analysis
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 shadow-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Task
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <KanbanBoard />
        )}

        {/* Risk Analysis View */}
        {riskAnalysis && (
          <div className="mt-8 p-6 bg-orange-50 border border-orange-100 rounded-xl relative animate-in fade-in slide-in-from-bottom-4">
            <button onClick={() => setRiskAnalysis(null)} className="absolute top-4 right-4 text-orange-400 hover:text-orange-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2" />
              AI Risk Analysis
            </h3>
            <div className="text-orange-900 text-sm whitespace-pre-wrap leading-relaxed">
              {riskAnalysis}
            </div>
          </div>
        )}

        {/* AI Generate Tasks Modal */}
        {isAiModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-purple-100 rounded-xl mr-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AI Task Generator</h3>
                  <p className="text-gray-500 text-sm">Describe what you want to achieve</p>
                </div>
              </div>
              <form onSubmit={handleAiGenerate} className="space-y-6">
                <div>
                  <textarea
                    required
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50 focus:bg-white transition-all min-h-[120px]"
                    placeholder="e.g. Generate tasks for setting up a CI/CD pipeline using GitHub Actions and AWS..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(false)}
                    className="px-5 py-2 text-gray-500 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="bg-purple-600 text-white px-8 py-2 rounded-xl hover:bg-purple-700 transition-all font-bold shadow-lg shadow-purple-100 active:scale-95 disabled:opacity-50 flex items-center"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : 'Generate Tasks'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Task Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-6">Create New Task</h3>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newTaskData.title}
                    onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                    value={newTaskData.description}
                    onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newTaskData.priority}
                    onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as TaskPriority })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
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
                    Create Task
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
