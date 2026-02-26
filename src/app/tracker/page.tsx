"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const toolsList = ["Drupal", "ICMS", "Drupal/ICMS/AEM", "kana", "AEM", "Drupal/ICMS", "Drupal/AEM", "ICMS/AEM"];
const pageCategories = [
    "Landing page", "Form Page", "PDF", "Image", "Deleted", "EDM", "Staging",
    "Blasting", "Homepage", "article page", "vanity", "Tagging", "Article",
    "vanity/pdf", "Landingpage/ Pdf"
];
const existingNewPageOps = ["Existing", "New", "Existing/New"];
const qcStatusOps = ["QC", "Non QC"];
const currentStatusOps = ["UAT", "PROD", "WIP", "Clarification", "onhold", "Preview"];
const slaBreachOps = ["Yes", "No"];
const typeOps = ["BAU", "NON BAU"];

export default function TrackerForm() {
    const { user } = useAuth();
    const formRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccess(false);
        setErrorMsg("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const form = e.currentTarget;
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to save entry");

            setSuccess(true);
            form.reset();

            // Success animation
            gsap.fromTo(".success-msg", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
        } catch (err: any) {
            setErrorMsg(err.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/40 transition-all placeholder:text-slate-400 font-medium";
    const labelClass = "block text-[13px] font-bold text-slate-500 mb-1.5 px-1";
    const groupClass = "relative";

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">New Tracker Entry</h1>
                <p className="text-slate-500 font-medium">Record task details accurately for reporting and SLA tracking.</p>
            </div>

            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden"
            >
                {success && (
                    <div className="success-msg mb-8 p-5 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-4 text-green-700 animate-in fade-in zoom-in duration-300">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="font-bold">Entry successfully recorded in the database!</p>
                    </div>
                )}

                {errorMsg && (
                    <div className="mb-8 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4 text-rose-700">
                        <AlertCircle className="w-6 h-6" />
                        <p className="font-bold">{errorMsg}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">

                    <div className={groupClass}>
                        <label className={labelClass}>Market</label>
                        <input name="market" type="text" className={inputClass} defaultValue="Citi SG" placeholder="e.g. US, UK..." required />
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>ALM Task #</label>
                        <input name="almTaskNumber" type="text" className={inputClass} placeholder="123456" required />
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Resource Name</label>
                        <input name="resourceName" type="text" className={inputClass} defaultValue={user?.name || ""} placeholder="Full Name" required />
                    </div>

                    <div className={`${groupClass} md:col-span-2 lg:col-span-3`}>
                        <label className={labelClass}>WMR/Description</label>
                        <textarea name="wmrDescription" rows={3} className={inputClass} placeholder="Enter a detailed description of the task..."></textarea>
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Raised Date</label>
                        <input name="raisedDate" type="date" className={inputClass} required />
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Start Date</label>
                        <input name="startDate" type="date" className={inputClass} />
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Delivered Date</label>
                        <input name="deliveredDate" type="date" className={inputClass} />
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>SLA Breach</label>
                        <select name="slaBreach" className={inputClass}>
                            <option value="">Select Option</option>
                            {slaBreachOps.map(op => <option key={op} value={op}>{op}</option>)}
                        </select>
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Type</label>
                        <select name="type" className={inputClass}>
                            <option value="">Select Type</option>
                            {typeOps.map(op => <option key={op} value={op}>{op}</option>)}
                        </select>
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Tool</label>
                        <select name="tool" className={inputClass}>
                            <option value="">Select Tool</option>
                            {toolsList.map(op => <option key={op} value={op}>{op}</option>)}
                        </select>
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Page Category</label>
                        <select name="pageCategory" className={inputClass}>
                            <option value="">Select Category</option>
                            {pageCategories.map(op => <option key={op} value={op}>{op}</option>)}
                        </select>
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Existing / New Page</label>
                        <select name="existingNewPage" className={inputClass}>
                            <option value="">Select Option</option>
                            {existingNewPageOps.map(op => <option key={op} value={op}>{op}</option>)}
                        </select>
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>QC Status</label>
                        <select name="qcStatus" className={inputClass}>
                            <option value="">Select Status</option>
                            {qcStatusOps.map(op => <option key={op} value={op}>{op}</option>)}
                        </select>
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Current Status</label>
                        <select name="currentStatus" className={inputClass}>
                            <option value="">Select Status</option>
                            {currentStatusOps.map(op => <option key={op} value={op}>{op}</option>)}
                        </select>
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>No. of Iterations</label>
                        <input name="noOfIterations" type="number" min="0" className={inputClass} placeholder="0" />
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Job Type</label>
                        <input name="jobType" type="text" className={inputClass} placeholder="e.g. Build, Update" />
                    </div>

                    <div className={groupClass}>
                        <label className={labelClass}>Changes Count / Efforts</label>
                        <input name="changesCountEfforts" type="text" className={inputClass} placeholder="e.g. 8 hrs" />
                    </div>

                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-4 bg-slate-900 hover:bg-black text-white text-sm font-black uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                    >
                        {isSubmitting ? "Processing..." : "Submit Entry"}
                    </button>
                </div>
            </form>
        </div>
    );
}
