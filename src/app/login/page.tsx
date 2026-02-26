"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Lock, Mail, Activity } from "lucide-react";
import gsap from "gsap";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { checkAuth, user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/");
    }

    // Modal entrance
    gsap.fromTo(".login-modal", 
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
    );

    // Background animation
    gsap.to(".bg-blob", {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      duration: "random(10, 20)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 2,
        from: "random"
      }
    });
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        await checkAuth(); // update context state
        router.push("/");
      } else {
        setError(data.error || "Login failed");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("A networking error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
      <div className="w-full max-w-5xl h-[600px] flex overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] bg-white mx-4 login-modal">
        {/* Left Side - Illustrative/Info (Mint Green Segment) */}
        <div className="hidden lg:flex w-1/2 bg-[#e8f8ed] p-12 flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-200/30 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 mb-10 w-full max-w-xs mx-auto">
            {/* Simple Illustration Placeholder with Activity */}
            <div className="bg-white p-10 rounded-full shadow-xl mb-10 transform scale-100 flex items-center justify-center">
              <Activity size={100} className="text-[#4caf50]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#1a3a2a] mb-4">Task Tracking Hub</h2>
            <p className="text-green-800/70 font-medium leading-relaxed">
              Unleash efficiency with our premium task management and reporting platform.
            </p>
          </div>
          
      
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-[#4caf50]" size={32} />
            <h1 className="text-2xl font-black text-[#1a3a2a] tracking-tight uppercase">Tracker</h1>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-800">Sign In</h3>
            <p className="text-slate-500 text-sm mt-1">Please enter your details following the link.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 font-bold animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-500 px-1">Username or email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all font-medium"
                placeholder="johnsmith007"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-slate-500 px-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all font-medium"
                placeholder="**********"
                required
              />
            </div>

           
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full mt-4 flex justify-center items-center py-4 px-4 rounded-xl text-sm font-bold text-white bg-[#1a2b3b] hover:bg-[#0f172a] transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Sign in"}
            </button>

           
           
          </form>
        </div>
      </div>
    </div>
  );

}
