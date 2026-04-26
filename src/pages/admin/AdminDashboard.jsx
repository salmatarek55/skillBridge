import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as adminService from "../../services/adminApi"; 

const STATS = [
  {
    key: "pendingProviders",
    label: "Pending Providers",
    bg: "bg-amber-500/10",
    link: "/admin/pending-providers",
  },
  {
    key: "pendingServices",
    label: "Pending Services",
    bg: "bg-indigo-500/10",
    link: "/admin/pending-services",
  },
];
const QUICK_LINKS = [
  { label: "Pending Providers", to: "/admin/pending-providers", desc: "Review new provider registrations" },
  { label: "Pending Services", to: "/admin/pending-services", desc: "Approve or reject service listings" },
  { label: "All Users", to: "/admin/all-users", desc: "View & manage all users" },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ pendingProviders: 0, pendingServices: 0 });

  useEffect(() => {
    adminService.getAdminStats().then(res => {
        if (res.data && res.data.success) {
            setCounts(res.data.data);
        }
    }).catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="max-h-screen max-w-screen  bg-[#141824] text-slate-100 px-5 py-10   font-sans   rounded-3xl shadow-2xl ">

      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <p className="text-[10px] tracking-[0.2em] text-slate-500 mb-1 font-bold uppercase">
            CONTROL CENTER
          </p>
          <h1 className="text-3xl font-black bg-gradient-to-r from-slate-200 to-indigo-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        <span className="text-[10px] px-4 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-bold uppercase tracking-widest">
          Admin Mode
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {STATS.map((s) => (
          <Link
            to={s.link}
            key={s.key}
            className="group bg-[#131720] border border-slate-800/50 rounded-2xl p-6 flex items-center gap-5 hover:border-indigo-500/50 hover:bg-[#161b29] transition-all duration-300 shadow-xl"
          >
            <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center text-xl`}>
              {s.key === "pendingProviders" ? "👤" : "💼"}
            </div>

            <div>
              <p className="text-3xl font-black tracking-tight">
                {counts[s.key] || 0}
              </p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>

            <span className="ml-auto w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:border-indigo-500 transition-all">
              →
            </span>
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent my-12" />

      {/* Quick Access Section */}
      <div className="mb-6">
        <h2 className="text-[10px] tracking-[0.3em] text-slate-500 font-black uppercase mb-6">
          Quick Access Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="group bg-[#131720] border border-slate-800/50 rounded-2xl p-5 hover:border-slate-600 transition-all hover:-translate-y-1 duration-300"
            >
              <p className="font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                {q.label}
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {q.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}