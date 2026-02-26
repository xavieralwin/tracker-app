"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Loader2, Trash2 } from "lucide-react";
import gsap from "gsap";

export default function AdminPanel() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();

        gsap.fromTo(".admin-card",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
        );
    }, []);

    const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsAdding(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const form = e.currentTarget;
        try {
            await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            form.reset();
            fetchUsers();
        } catch (error) {
            console.error(error);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to delete user");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/40 transition-all placeholder:text-slate-400 font-medium";

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Admin Panel</h1>
                <p className="text-slate-500 font-medium">Manage application users, roles, and permissions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* Create User Form */}
                <div className="admin-card bg-white border border-slate-100 rounded-[2.5rem] p-8 h-fit shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100 text-green-600">
                        <div className="p-2 bg-green-50 rounded-xl">
                            <UserPlus size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Add User</h2>
                    </div>

                    <form onSubmit={handleCreateUser} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-bold text-slate-500 px-1">Full Name</label>
                            <input name="name" type="text" className={inputClass} placeholder="John Doe" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-bold text-slate-500 px-1">Email Address</label>
                            <input name="email" type="email" className={inputClass} placeholder="john@example.com" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-bold text-slate-500 px-1">Password</label>
                            <input name="password" type="password" className={inputClass} placeholder="••••••••" required />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-bold text-slate-500 px-1">Role</label>
                            <select name="role" className={inputClass + " cursor-pointer"} defaultValue="USER">
                                <option value="USER">Standard User</option>
                                <option value="ADMIN">Administrator</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isAdding}
                            className="w-full mt-6 px-4 py-3.5 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                            {isAdding ? <Loader2 size={18} className="animate-spin" /> : "Create User"}
                        </button>
                    </form>
                </div>

                {/* Users List */}
                <div className="admin-card md:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm overflow-hidden">
                    <h2 className="text-xl font-bold text-slate-900 mb-8">Registered Users</h2>

                    <div className="overflow-x-auto rounded-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-widest font-black border-b border-slate-100">
                                    <th className="py-4 px-6">Name</th>
                                    <th className="py-4 px-6">Email</th>
                                    <th className="py-4 px-6">Role</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-500">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-green-500" />
                                            <p className="font-bold">Loading users...</p>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-green-50/30 transition-colors group"
                                            style={{ animationDelay: `${idx * 0.05}s` }}
                                        >
                                            <td className="py-5 px-6 text-slate-900 font-bold">{user.name}</td>
                                            <td className="py-5 px-6 text-slate-500 font-medium">{user.email}</td>
                                            <td className="py-5 px-6">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full border ${user.role === 'ADMIN' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
