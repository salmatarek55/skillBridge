import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { getProviderOrders } from "../../services/RequestApi";

import { FaCheckCircle } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

export default function CompletedOrders() {
  const { user } = useContext(AuthContext);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["providerOrders", user?.id],
    queryFn: getProviderOrders,
    enabled: !!user?.id,
  });
///////////////////////////////////////
  useEffect(() => {
    if (isError) toast.error("Failed to load completed orders");
  }, [isError]);
///////////////////////////////////////
  const completedOrders = orders.filter((o) => o.status === "completed");
///////////////////////////////////////
  const totalEarnings = completedOrders.reduce(
    (sum, o) => sum + (o.agreedPrice ?? o.servicePrice ?? 0),
    0
  );
///////////////////////////////////////
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-indigo-100 p-6 sm:p-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              Provider Panel
            </p>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 bg-clip-text text-transparent">
              Completed Orders
            </h1>
          </div>

          {!isLoading && completedOrders.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-semibold flex items-center gap-1">
                <FaCheckCircle />
                {completedOrders.length} Completed
              </span>

              <span className="text-xs px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-600 font-semibold flex items-center gap-1">
                <FaMoneyBillWave />
                ${totalEarnings.toFixed(2)} Earned
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-emerald-50/60 animate-pulse"
              />
            ))}
          </div>
        ) : completedOrders.length === 0 ? (
          <div className="text-center py-16 bg-emerald-50 border border-emerald-100 rounded-xl">
            <FaCheckCircle className="text-4xl mx-auto mb-3 text-emerald-500" />
            <p className="text-emerald-400 font-medium text-sm">
              No completed orders yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-emerald-50">
            {completedOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 py-5 first:pt-0 last:pb-0"
              >
                {/* Client info */}
                <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                  {order.clientAvatar ? (
                    <img
                      src={order.clientAvatar}
                      alt={order.clientName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {initials(order.clientName)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-indigo-900 truncate">
                      {order.clientName}
                    </p>
                    <p className="text-xs text-indigo-400 flex items-center gap-1">
                      <FaUserCircle /> Client
                    </p>
                  </div>
                </div>

                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-indigo-900 mb-1.5 truncate">
                    {order.serviceTitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                      <FaMoneyBillWave />
                      ${order.agreedPrice ?? order.servicePrice ?? 0}
                    </span>

                    {order.completedAt && (
                      <span className="text-xs text-indigo-300 flex items-center gap-1">
                        <FaCalendarCheck />
                        {new Date(order.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold flex items-center gap-1 flex-shrink-0">
                  <FaCheckCircle />
                  Completed
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}