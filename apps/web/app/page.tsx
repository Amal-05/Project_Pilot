"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { Shield, Sparkles, Kanban, Users, AlertTriangle, ArrowRight } from "lucide-react";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:32px_32px] opacity-20" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[160px] opacity-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[160px] opacity-10" />

      {/* Navigation Header */}
      <header className="z-10 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-6 flex justify-between items-center border-b border-slate-800/60 backdrop-blur-md bg-slate-900/40 sticky top-0">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600/20 p-2 rounded-xl border border-blue-500/30">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            ProjectPilot
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-blue-900/30 flex items-center space-x-1"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-white px-4 py-2 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-blue-900/30"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="z-10 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Intelligent Project Management</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl leading-tight">
          Manage projects with the power of{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
            Artificial Intelligence
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Streamline tasks, collaborate in real-time, generate automated AI task suggestions, and analyze project risks before they impact your team.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/40 text-lg flex items-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/40 text-lg flex items-center space-x-2"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-8 py-4 rounded-xl font-semibold transition-colors text-lg"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights */}
        <section className="mt-24 sm:mt-32 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-left hover:border-slate-700 transition-colors backdrop-blur-sm">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl w-fit mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-100">AI Assistance</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate full project lists, task structures, and dependencies instantly based on prompts.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-left hover:border-slate-700 transition-colors backdrop-blur-sm">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit mb-4">
              <Kanban className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-100">Kanban Boards</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Visualize workflow, drag and drop tasks, organize sprints, and manage backlog cleanly.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-left hover:border-slate-700 transition-colors backdrop-blur-sm">
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl w-fit mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-100">Real-time Collaboration</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Integrated real-time chat, dedicated group conversation rooms, and project discussion boards.
            </p>
          </div>

          <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 text-left hover:border-slate-700 transition-colors backdrop-blur-sm">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl w-fit mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-100">Risk Analysis</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Scan task list states and sprint velocity to identify bottlenecks and highlight critical blockers.
            </p>
          </div>
        </section>
      </main>

      <footer className="z-10 mt-auto border-t border-slate-800/60 py-8 text-center text-sm text-slate-500 max-w-7xl w-full mx-auto px-6">
        &copy; {new Date().getFullYear()} ProjectPilot. All rights reserved.
      </footer>
    </div>
  );
}
