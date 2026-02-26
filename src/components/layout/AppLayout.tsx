"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileSpreadsheet, Users, Activity, LogOut, User as UserIcon } from "lucide-react";
import gsap from "gsap";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["ADMIN", "USER"] },
    { name: "Tracker Entry", href: "/tracker", icon: FileSpreadsheet, roles: ["ADMIN", "USER"] },
    { name: "Admin Panel", href: "/admin", icon: Users, roles: ["ADMIN"] },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    
    const sidebarRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && !user && pathname !== "/login") {
            router.push("/login");
        }
    }, [user, loading, pathname, router]);

    useEffect(() => {
        // Entrance animations
        if (sidebarRef.current && contentRef.current) {
            gsap.fromTo(
                sidebarRef.current,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
            );
            gsap.fromTo(
                contentRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
            );
        }
    }, []);

    if (pathname === "/login") {
        return <main className="h-screen w-full bg-slate-950 font-sans">{children}</main>;
    }

    if (loading || !user) {
        return <div className="h-screen w-full bg-slate-950 flex items-center justify-center text-indigo-400">Loading Tracker...</div>;
    }

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="flex h-screen w-full bg-[#f8fbfa] text-slate-800 overflow-hidden font-sans">
            {/* Sidebar - Clean Light Theme */}
            <aside
                ref={sidebarRef}
                className="w-64 h-full flex flex-col border-r border-slate-200 bg-white relative z-10 shadow-sm"
            >
                <div className="p-6 flex items-center gap-3 border-b border-slate-100 text-green-600">
                    <div className="p-2 bg-green-50 rounded-xl">
                        <Activity size={24} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                        SG Tracker
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1.5">
                    {filteredNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-green-50 text-green-700 font-semibold"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                <item.icon
                                    size={20}
                                    className={clsx(
                                        "transition-colors duration-200",
                                        isActive ? "text-green-600" : "text-slate-400 group-hover:text-slate-600"
                                    )}
                                />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 flex flex-col gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                            <UserIcon size={18} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 truncate">{user.role}</p>
                        </div>
                    </div>
                    <button 
                        onClick={logout}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all text-sm font-medium shadow-sm"
                    >
                        <LogOut size={14} />
                        <span>Sign out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-full relative z-10 overflow-y-auto">
                <div ref={contentRef} className="p-8 pb-20 max-w-7xl mx-auto min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
