"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LayoutDashboard, AlertTriangle, FileSpreadsheet, Loader2, Trash2, Download } from "lucide-react";
import gsap from "gsap";
import { useAuth } from "@/contexts/AuthContext";

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6'];

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResource, setFilterResource] = useState("");
  const [filterMarket, setFilterMarket] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchTasks();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete task");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadCSV = () => {
    if (tasks.length === 0) return;

    const headers = [
      "ID", "Market", "ALM Task #", "Resource Name", "WMR Description", 
      "Raised Date", "Start Date", "Delivered Date", "SLA Breach", 
      "Type", "Tool", "Page Category", "Existing/New", "Iterations", 
      "Job Type", "Effort", "QC Status", "Current Status", "Created At"
    ];

    const csvContent = [
      headers.join(","),
      ...tasks.map(t => [
        t.id,
        `"${(t.market || "").replace(/"/g, '""')}"`,
        `"${(t.almTaskNumber || "").replace(/"/g, '""')}"`,
        `"${(t.resourceName || "").replace(/"/g, '""')}"`,
        `"${(t.wmrDescription || "").replace(/"/g, '""')}"`,
        t.raisedDate ? new Date(t.raisedDate).toLocaleDateString() : "",
        t.startDate ? new Date(t.startDate).toLocaleDateString() : "",
        t.deliveredDate ? new Date(t.deliveredDate).toLocaleDateString() : "",
        t.slaBreach || "",
        t.type || "",
        t.tool || "",
        t.pageCategory || "",
        t.existingNewPage || "",
        t.noOfIterations || "",
        t.jobType || "",
        `"${(t.changesCountEfforts || "").replace(/"/g, '""')}"`,
        t.qcStatus || "",
        t.currentStatus || "",
        new Date(t.createdAt).toLocaleString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Tracker_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(".dashboard-item",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-indigo-400 gap-4 mt-32">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-lg">Loading Reports Data...</p>
      </div>
    );
  }

  // Filter Logic
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      (t.almTaskNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.wmrDescription || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.resourceName || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesResource = filterResource === "" || t.resourceName === filterResource;
    const matchesMarket = filterMarket === "" || t.market === filterMarket;
    const matchesStatus = filterStatus === "" || t.currentStatus === filterStatus;

    return matchesSearch && matchesResource && matchesMarket && matchesStatus;
  });

  // Unique values for filters
  const resources = Array.from(new Set(tasks.map(t => t.resourceName).filter(Boolean))) as string[];
  const markets = Array.from(new Set(tasks.map(t => t.market).filter(Boolean))) as string[];
  const statuses = Array.from(new Set(tasks.map(t => t.currentStatus).filter(Boolean))) as string[];

  // Derived metrics
  const totalTasks = tasks.length;
  const slaBreaches = tasks.filter(t => t.slaBreach === "Yes").length;
  const qcTasks = tasks.filter(t => t.qcStatus === "QC").length;

  // Chart Data
  const toolCount = tasks.reduce((acc, task) => {
    if (task.tool) acc[task.tool] = (acc[task.tool] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const toolData = Object.keys(toolCount).map(name => ({ name, value: toolCount[name] }));

  const categoryCount = tasks.reduce((acc, task) => {
    if (task.pageCategory) acc[task.pageCategory] = (acc[task.pageCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categoryData = Object.keys(categoryCount).map(name => ({ name, value: categoryCount[name] }));

  const filterSelectClass = "bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/50 transition-all cursor-pointer shadow-sm";

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Overall Report</h1>
          <p className="text-slate-500 font-medium">Analytics and overview for your tracking data.</p>
        </div>
        {user?.role === 'ADMIN' && tasks.length > 0 && (
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold transition-all shadow-sm hover:shadow-md"
          >
            <Download size={20} className="text-green-600" />
            Download CSV Report
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-item bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 text-green-50 opacity-20 group-hover:scale-110 transition-transform"><FileSpreadsheet size={120} /></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2 px-1">Total Entries</p>
          <h3 className="text-5xl font-black text-slate-900">{totalTasks}</h3>
          <div className="mt-4 w-12 h-1.5 bg-green-500 rounded-full"></div>
        </div>

        <div className="dashboard-item bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 text-rose-50 opacity-20 group-hover:scale-110 transition-transform"><AlertTriangle size={120} /></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2 px-1">SLA Breaches</p>
          <h3 className="text-5xl font-black text-slate-900">{slaBreaches}</h3>
          <div className="mt-4 w-12 h-1.5 bg-rose-500 rounded-full"></div>
        </div>

        <div className="dashboard-item bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-6 text-indigo-50 opacity-20 group-hover:scale-110 transition-transform"><LayoutDashboard size={120} /></div>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-2 px-1">Quality Checks</p>
          <h3 className="text-5xl font-black text-slate-900">{qcTasks}</h3>
          <div className="mt-4 w-12 h-1.5 bg-indigo-500 rounded-full"></div>
        </div>
      </div>

      {/* Charts */}
      {totalTasks > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="dashboard-item bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8">Tasks by Tool</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toolData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 8, 8]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-item bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-8">Page Categories</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="40%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    label={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="dashboard-item bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <h3 className="text-xl font-bold text-slate-900">Tracker Entries</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-grow md:flex-grow-0 md:min-w-[280px]">
              <input 
                type="text" 
                placeholder="Search entries..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/40 transition-all font-medium"
              />
            </div>

            <select value={filterResource} onChange={(e) => setFilterResource(e.target.value)} className={filterSelectClass}>
              <option value="">All Resources</option>
              {resources.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={filterSelectClass}>
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            {(searchTerm || filterResource || filterMarket || filterStatus) && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setFilterResource("");
                  setFilterMarket("");
                  setFilterStatus("");
                }}
                className="text-xs font-bold text-green-600 hover:text-green-700 px-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-widest font-black border-b border-slate-100">
                <th className="py-4 px-6">ALM Task #</th>
                <th className="py-4 px-6">Market</th>
                <th className="py-4 px-6">Resource</th>
                <th className="py-4 px-6">Tool</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">SLA Breach</th>
                <th className="py-4 px-6">Delivered</th>
                {user?.role === 'ADMIN' && <th className="py-4 px-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'ADMIN' ? 8 : 7} className="py-12 text-center text-slate-400 font-medium">
                    No matching entries found.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-green-50/30 transition-colors group">
                    <td className="py-4 px-6 text-slate-900 font-bold">{task.almTaskNumber || '-'}</td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{task.market || '-'}</td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{task.resourceName || '-'}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">{task.tool || '-'}</span>
                    </td>
                    <td className="py-4 px-6">
                      {task.currentStatus ? (
                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full bg-green-50 text-green-700 border border-green-100">
                          {task.currentStatus}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-4 px-6">
                      {task.slaBreach === "Yes" ? (
                        <span className="text-rose-600 text-xs font-black uppercase tracking-tighter flex items-center gap-1"><AlertTriangle size={14} /> Breach</span>
                      ) : (
                        <span className="text-slate-400 text-xs font-bold">On Time</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-sm font-medium">
                      {task.deliveredDate ? new Date(task.deliveredDate).toLocaleDateString() : '-'}
                    </td>
                    {user?.role === 'ADMIN' && (
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

}
