"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";
import { Shield, Lock, Mail, Loader2, ArrowRight, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await api.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error(err);
      if (!err.response) {
        setError("Network error: Unable to connect to the API server. Please check your connection.");
      } else {
        setError(
          err.response?.data?.message || 
          "Failed to register. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const triggerGoogleLogin = async (acc: { name: string; email: string; googleId: string }) => {
    setShowGoogleChooser(false);
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const parts = acc.name.split(" ");
      const firstName = parts[0] || "Google";
      const lastName = parts.slice(1).join(" ") || "User";
      
      const response = await api.post("/auth/google", {
        email: acc.email,
        googleId: acc.googleId,
        firstName,
        lastName,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(acc.name)}`
      });
      const { user, accessToken, refreshToken } = response.data;
      setAuth(user, accessToken, refreshToken);
      setSuccess("Authenticated with Google successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        "Google authentication failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left decoration panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-slate-900 via-indigo-950 to-blue-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full blur-[120px] opacity-20" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-20" />
        
        <div className="z-10 flex items-center space-x-2">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            ProjectPilot
          </span>
        </div>

        <div className="z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Build projects faster, smarter.
          </h1>
          <p className="text-slate-300 leading-relaxed">
            Create an account to start generating tasks with AI, organizing them with interactive Kanban boards, and tracking project risks.
          </p>
        </div>

        <div className="z-10 text-xs text-slate-400">
          &copy; {new Date().getFullYear()} ProjectPilot. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Start your free trial today
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-9 w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-9 w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2.5 border border-slate-300 rounded-xl bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900"
                  placeholder="At least 8 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-slate-50 text-slate-500 font-medium">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowGoogleChooser(true)}
            className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-center space-x-2.5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.26620003,9.76453182 C6.19878753,6.93863636 8.85444377,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.52272727 16.4136364,6.53636364 L19.9054545,3.04454545 C17.7818182,1.15909091 15.0272727,0 12,0 C7.37954545,0 3.39727273,2.65909091 1.45454545,6.54090909 L5.26620003,9.76453182 Z"
              />
              <path
                fill="#4285F4"
                d="M23.4900002,12.2727273 C23.4900002,11.4136364 23.4136365,10.5909091 23.2727274,9.81818182 L12,9.81818182 L12,14.4818182 L18.4545455,14.4818182 C18.1727273,16.0045455 17.3136364,17.2909091 16.0272727,18.1545455 L19.9054545,21.1590909 C22.1727273,19.0681818 23.4900002,15.9636364 23.4900002,12.2727273 Z"
              />
              <path
                fill="#FBBC05"
                d="M5.26620003,9.76453182 C5.0227273,10.4909091 4.88636364,11.2681818 4.88636364,12.0727273 C4.88636364,12.8772727 5.0227273,13.6545455 5.26620003,14.3809091 L1.45454545,17.6045455 C0.527272727,15.7409091 0,13.6363636 0,12.0727273 C0,10.5090909 0.527272727,8.40454545 1.45454545,6.54090909 L5.26620003,9.76453182 Z"
              />
              <path
                fill="#34A853"
                d="M12,19.1818182 C8.85444377,19.1818182 6.19878753,17.1522727 5.26620003,14.3263636 L1.45454545,17.55 C3.39727273,21.4318182 7.37954545,24 12,24 C15.0272727,24 17.7818182,23.0136364 19.9054545,21.3272727 L16.0272727,18.3227273 C14.9318182,19.0590909 13.5772727,19.1818182 12,19.1818182 Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-sm text-slate-500 mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {showGoogleChooser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center border-b border-slate-100">
              <div className="flex justify-center mb-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.26620003,9.76453182 C6.19878753,6.93863636 8.85444377,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.52272727 16.4136364,6.53636364 L19.9054545,3.04454545 C17.7818182,1.15909091 15.0272727,0 12,0 C7.37954545,0 3.39727273,2.65909091 1.45454545,6.54090909 L5.26620003,9.76453182 Z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.4900002,12.2727273 C23.4900002,11.4136364 23.4136365,10.5909091 23.2727274,9.81818182 L12,9.81818182 L12,14.4818182 L18.4545455,14.4818182 C18.1727273,16.0045455 17.3136364,17.2909091 16.0272727,18.1545455 L19.9054545,21.1590909 C22.1727273,19.0681818 23.4900002,15.9636364 23.4900002,12.2727273 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.26620003,9.76453182 C5.0227273,10.4909091 4.88636364,11.2681818 4.88636364,12.0727273 C4.88636364,12.8772727 5.0227273,13.6545455 5.26620003,14.3809091 L1.45454545,17.6045455 C0.527272727,15.7409091 0,13.6363636 0,12.0727273 C0,10.5090909 0.527272727,8.40454545 1.45454545,6.54090909 L5.26620003,9.76453182 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12,19.1818182 C8.85444377,19.1818182 6.19878753,17.1522727 5.26620003,14.3263636 L1.45454545,17.55 C3.39727273,21.4318182 7.37954545,24 12,24 C15.0272727,24 17.7818182,23.0136364 19.9054545,21.3272727 L16.0272727,18.3227273 C14.9318182,19.0590909 13.5772727,19.1818182 12,19.1818182 Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Sign in with Google</h3>
              <p className="text-xs text-slate-500 mt-1">to continue to ProjectPilot</p>
            </div>
            
            <div className="p-4 space-y-2 max-h-60 overflow-y-auto">
              {[
                { name: "Alex Rivera", email: "alex.rivera@gmail.com", avatar: "AR", googleId: "google-109283741" },
                { name: "Sarah Chen", email: "sarah.chen@gmail.com", avatar: "SC", googleId: "google-283746192" },
                { name: "Marcus Johnson", email: "marcus.j@gmail.com", avatar: "MJ", googleId: "google-374619283" }
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => triggerGoogleLogin(acc)}
                  className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-sm border border-slate-200">
                    {acc.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{acc.name}</p>
                    <p className="text-xs text-slate-500 truncate">{acc.email}</p>
                  </div>
                </button>
              ))}

              <div className="border-t border-slate-100 pt-3 mt-2">
                <p className="text-xs font-semibold text-slate-400 px-3 mb-2">Or use another Google account</p>
                <div className="px-3 space-y-2">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    id="customGoogleEmail"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val && val.includes('@')) {
                          const name = val.split('@')[0];
                          const firstName = name.charAt(0).toUpperCase() + name.slice(1);
                          triggerGoogleLogin({
                            name: `${firstName} User`,
                            email: val,
                            googleId: `google-custom-${Date.now()}`
                          });
                        }
                      }
                    }}
                  />
                  <p className="text-[10px] text-slate-400">Press Enter to sign in with this custom email</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between text-xs text-slate-500">
              <button type="button" onClick={() => setShowGoogleChooser(false)} className="hover:text-slate-800 transition-colors">
                Cancel
              </button>
              <div className="flex space-x-2">
                <a href="#" className="hover:underline">Privacy</a>
                <span>&middot;</span>
                <a href="#" className="hover:underline">Terms</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
