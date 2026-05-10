import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { getProviderServices } from "../../services/ServiceApi";
import {
  getProviderOrders,
  getProviderRequests,
} from "../../services/RequestApi";

const QUICK_LINKS = [
  {
    label: "My Services",
    to: "/my-services",
    icon: "💼",
    bg: "bg-indigo-50",
    border: "border-indigo-100 hover:border-indigo-300",
    text: "text-indigo-700",
    sub: "text-indigo-400",
  },
  {
    label: "Incoming Requests",
    to: "/incoming-requests",
    icon: "📥",
    bg: "bg-purple-50",
    border: "border-purple-100 hover:border-purple-300",
    text: "text-purple-700",
    sub: "text-purple-400",
  },
  {
    label: "Active Orders",
    to: "/orders",
    icon: "📦",
    bg: "bg-violet-50",
    border: "border-violet-100 hover:border-violet-300",
    text: "text-violet-700",
    sub: "text-violet-400",
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
    queryFn: () => getProviderOrders(user.id),
    enabled: !!user?.id,
  });

  const { data: incoming = [], isError: rErr } = useQuery({
    queryKey: ["providerRequests", user?.id],
    queryFn: () => getProviderRequests(user.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (sErr || oErr || rErr) toast.error("Failed to load dashboard data");
  }, [sErr, oErr, rErr]);

  const activeOrders = orders.filter((o) => o.status === "accepted");

  const completedOrders = orders.filter((o) => o.status === "completed");

  const pendingServices = services.filter((s) => s.status === "pending");

  // Total earnings = sum of price of completed orders
  const totalEarnings = completedOrders.reduce(
    (sum, o) => sum + (o.servicePrice || 0),
    0,
  );

  const STATS = [
    {
      label: "Active Orders",
      value: activeOrders.length,
      icon: "📦",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      text: "text-indigo-800",
      sub: "text-indigo-400",
      to: "/orders",
    },
    {
      label: "Pending Requests",
      value: incoming.length,
      icon: "📥",
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-800",
      sub: "text-purple-400",
      to: "/incoming-requests",
    },
    {
      label: "Pending Services",
      value: pendingServices.length,
      icon: "💼",
      bg: "bg-violet-50",
      border: "border-violet-100",
      text: "text-violet-800",
      sub: "text-violet-400",
      to: "/my-services",
    },
    {
      label: "Total Earnings",
      value: `$${totalEarnings}`,
      icon: "💰",
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-800",
      sub: "text-green-400",
      to: null,
    },
    {
      label: "Completed Orders",
      value: completedOrders.length,
      icon: "✅",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-800",
      sub: "text-emerald-400",
      to: "/orders",
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
              Welcome back {user?.name?.split(" ")[0]}
            </h1>
          </div>
          <span className="text-xs px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-600 font-semibold">
            Provider
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {STATS.map((s) => {
            const inner = (
              <div
                className={`flex flex-col gap-2 ${s.bg} border ${s.border} rounded-xl p-4 h-full ${s.to ? "hover:shadow-md transition-all duration-200" : ""}`}
              >
                <span className="text-2xl">{s.icon}</span>
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
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className={`flex flex-col gap-2 ${q.bg} border ${q.border} rounded-xl p-5 hover:shadow-md transition-all duration-200`}
            >
              <span className="text-2xl">{q.icon}</span>
              <p className={`font-semibold text-sm ${q.text}`}>{q.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
