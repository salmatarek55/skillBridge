import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as adminService from "../../services/adminApi";

import {
  FiUser,
  FiBriefcase,
  FiUsers,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";

const QUICK_LINKS = [
  {
    label: "Pending Providers",
    to: "/admin/pending-providers",
    desc: "Review new provider registrations",
    icon: <FiUser />,
    bg: "bg-purple-50",
    border: "border-purple-100 hover:border-purple-300",
    text: "text-purple-700",
    sub: "text-purple-400",
  },
  {
    label: "Pending Services",
    to: "/admin/pending-services",
    desc: "Approve or reject service listings",
    icon: <FiBriefcase />,
    bg: "bg-purple-50",
    border: "border-purple-100 hover:border-purple-300",
    text: "text-purple-700",
    sub: "text-purple-400",
  },
  {
    label: "All Users",
    to: "/admin/all-users",
    desc: "View & manage all platform users",
    icon: <FiUsers />,
    bg: "bg-violet-50",
    border: "border-violet-100 hover:border-violet-300",
    text: "text-violet-700",
    sub: "text-violet-400",
  },
];

export default function AdminDashboard() {
  const { data, isError } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await adminService.getAdminStats();
      return res.data.data;
    },
  });
////////////////////////////////////
  useEffect(() => {
    if (isError) toast.error("Failed to load stats");
  }, [isError]);
//////////////////////////////////////
  const counts = data || {
    pendingProviders: 0,
    pendingServices: 0,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-indigo-100 p-6 sm:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-1">
              Control Center
            </p>

            <h1 className="text-2xl font-bold text-purple-600">
              Admin Dashboard
            </h1>
          </div>

          <span className="inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-600 font-semibold">
            <FiShield />
            Admin Mode
          </span>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

          <Link
            to="/admin/pending-providers"
            className="group flex items-center gap-4 bg-indigo-50 border border-indigo-100 rounded-xl p-5 hover:shadow-md hover:border-indigo-300 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl text-white shadow-sm flex-shrink-0">
              <FiUser />
            </div>

            <div>
              <p className="text-3xl font-bold text-purple-800">
                {counts.pendingProviders}
              </p>

              <p className="text-xs font-medium text-purple-500 mt-0.5">
                Pending Providers
              </p>
            </div>

            <span className="ml-auto text-purple-200 group-hover:text-purple-500 transition-colors text-xl">
              <FiArrowRight />
            </span>
          </Link>

          <Link
            to="/admin/pending-services"
            className="group flex items-center gap-4 bg-purple-50 border border-purple-100 rounded-xl p-5 hover:shadow-md hover:border-purple-300 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl text-white shadow-sm flex-shrink-0">
              <FiBriefcase />
            </div>

            <div>
              <p className="text-3xl font-bold text-purple-800">
                {counts.pendingServices}
              </p>

              <p className="text-xs font-medium text-purple-500 mt-0.5">
                Pending Services
              </p>
            </div>

            <span className="ml-auto text-purple-200 group-hover:text-purple-500 transition-colors text-xl">
              <FiArrowRight />
            </span>
          </Link>

        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-100 to-transparent mb-8" />

        {/* Quick Links */}
        <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mb-4">
          Quick Access
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className={`group flex flex-col gap-2 ${q.bg} border ${q.border} rounded-xl p-5 hover:shadow-md transition-all duration-200`}
            >
              <span className="text-2xl text-purple-600">
                {q.icon}
              </span>

              <p className={`font-semibold text-sm ${q.text}`}>
                {q.label}
              </p>

              <p className={`text-xs ${q.sub} leading-relaxed`}>
                {q.desc}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}