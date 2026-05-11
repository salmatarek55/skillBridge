import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { getProviderServices } from "../../services/ServiceApi";
import {
  getProviderOrders,
  getProviderRequests,
  getProviderDashboard,
} from "../../services/RequestApi";


import {
  FaBriefcase,
  FaInbox,
  FaBox,
  FaDollarSign,
  FaCheckCircle,
} from "react-icons/fa";

const QUICK_LINKS = [
  {
    label: "My Services",
    to: "/my-services",
    icon: FaBriefcase,
    bg: "bg-indigo-50",
    border: "border-indigo-100 hover:border-indigo-300",
    text: "text-indigo-700",
    iconColor: "text-indigo-500",
  },
  {
    label: "Incoming Requests",
    to: "/incoming-requests",
    icon: FaInbox,
    bg: "bg-purple-50",
    border: "border-purple-100 hover:border-purple-300",
    text: "text-purple-700",
    iconColor: "text-purple-500",
  },
  {
    label: "Active Orders",
    to: "/orders",
    icon: FaBox,
    bg: "bg-violet-50",
    border: "border-violet-100 hover:border-violet-300",
    text: "text-violet-700",
    iconColor: "text-violet-500",
  },
];

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const { data: services = [], isError: sErr } = useQuery({
    queryKey: ["providerServices", user?.id],
    queryFn: getProviderServices,
    enabled: !!user?.id,
  });

  const { data: orders = [], isError: oErr } = useQuery({
    queryKey: ["providerOrders", user?.id],
    queryFn: getProviderOrders,
    enabled: !!user?.id,
  });

  const { data: incoming = [], isError: rErr } = useQuery({
    queryKey: ["providerRequests", user?.id],
    queryFn: getProviderRequests,
    enabled: !!user?.id,
  });

  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard", user?.id],
    queryFn: getProviderDashboard,
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (sErr || oErr || rErr) {
      toast.error("Failed to load dashboard data");
    }
  }, [sErr, oErr, rErr]);

  const activeOrders = orders.filter((o) => o.status === "accepted");
  const completedOrders = orders.filter((o) => o.status === "completed");

  const pendingServices = services.filter(
    (s) => s.status && s.status.toLowerCase().trim() === "pending"
  );

  const totalEarnings = dashboardData?.totalEarnings > 0
    ? dashboardData.totalEarnings
    : completedOrders.reduce((sum, o) => sum + (o.agreedPrice || o.servicePrice || 0), 0);
  const STATS = [
    {
      label: "Active Orders",
      value: dashboardData?.activeOrdersCount ?? activeOrders.length,
      icon: FaBox,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      text: "text-indigo-800",
      sub: "text-indigo-400",
      iconColor: "text-indigo-500",
      to: "/orders",
    },
    {
      label: "Pending Requests",
      value: incoming.length,
      icon: FaInbox,
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-800",
      sub: "text-purple-400",
      iconColor: "text-purple-500",
      to: "/incoming-requests",
    },
    {
      label: "Pending Services",
      value: pendingServices.length,
      icon: FaBriefcase,
      bg: "bg-violet-50",
      border: "border-violet-100",
      text: "text-violet-800",
      sub: "text-violet-400",
      iconColor: "text-violet-500",
      to: "/pending-services",
    },
    {
      label: "Total Earnings",
      value: `$${Number(totalEarnings).toFixed(2)}`,
      icon: FaDollarSign,
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-800",
      sub: "text-green-400",
      iconColor: "text-green-500",
      to: null,
    },
    {
      label: "Completed Orders",
      value: completedOrders.length,
      icon: FaCheckCircle,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-800",
      sub: "text-emerald-400",
      iconColor: "text-emerald-500",
      to: "/completed-orders",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-indigo-100 p-6 sm:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              Provider Panel
            </p>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-purple-300 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
          </div>

          <span className="text-xs px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-600 font-semibold">
            Provider
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {STATS.map((s) => {
            const Icon = s.icon;

            const inner = (
              <div
                className={`flex flex-col gap-2 ${s.bg} border ${s.border} rounded-xl p-4 h-full`}
              >
                <Icon className={`text-2xl ${s.iconColor}`} />
                <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                <p className={`text-xs font-medium ${s.sub}`}>{s.label}</p>
              </div>
            );

            return s.to ? (
              <Link key={s.label} to={s.to}>
                {inner}
              </Link>
            ) : (
              <div key={s.label}>{inner}</div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-100 to-transparent mb-8" />

        {/* Quick Links */}
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
          Quick Access
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_LINKS.map((q) => {
            const Icon = q.icon;

            return (
              <Link
                key={q.to}
                to={q.to}
                className={`flex flex-col gap-2 ${q.bg} border ${q.border} rounded-xl p-5 hover:shadow-md transition-all duration-200`}
              >
                <Icon className={`text-2xl ${q.iconColor}`} />
                <p className={`font-semibold text-sm ${q.text}`}>
                  {q.label}
                </p>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}