import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { getProviderOrders, completeOrder } from "../../services/RequestApi";
import { getCategoryByName } from "../../data/categories";
import { FaCheckCircle } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

export default function ProviderOrders() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["providerOrders", user?.id],
    queryFn: getProviderOrders,
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (isError) toast.error("Failed to load orders");
  }, [isError]);

  const activeOrders = orders.filter(
    (o) => o.status?.toLowerCase() === "accepted"
  );

  const totalValue = activeOrders.reduce(
    (sum, o) => sum + (o.agreedPrice ?? o.servicePrice ?? 0),
    0
  );

  const { mutate: markComplete, isPending, variables } = useMutation({
    mutationFn: (requestId) => completeOrder(requestId),

    onSuccess: () => {
      toast.success("Order marked as completed 🎉");

      queryClient.invalidateQueries({
        queryKey: ["providerOrders", user?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["providerRequests", user?.id],
      });
    },

    onError: () => toast.error("Failed to update order"),
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-indigo-100 p-6 sm:p-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              Provider Panel
            </p>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-purple-300 to-purple-600 bg-clip-text text-transparent">
              Active Orders
            </h1>
          </div>

          {!isLoading && (
            <div className="flex gap-2 flex-wrap">

              <span className="flex items-center gap-1 text-xs px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-semibold">
                <FaUserCircle className="text-indigo-500" />
                {activeOrders.length} Active
              </span>

              <span className="flex items-center gap-1 text-xs px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-600 font-semibold">
                <FaMoneyBillWave className="text-green-500" />
                ${totalValue.toFixed(2)}
              </span>

            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-indigo-50/60 animate-pulse" />
            ))}
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="text-center py-16 bg-purple-50 border border-purple-100 rounded-xl">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-purple-500 font-semibold text-sm mb-1">
              No active orders
            </p>
            <p className="text-purple-300 text-xs">
              Completed orders will appear in Completed Orders page.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-indigo-50">

            {activeOrders.map((order) => {
              const isThisBusy = isPending && variables === order.id;

              const cat = order.serviceCategory
                ? getCategoryByName(order.serviceCategory)
                : null;

              return (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 py-5"
                >

                  {/* Client */}
                  <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">

                    {order.clientAvatar ? (
                      <img
                        src={order.clientAvatar}
                        className="w-10 h-10 rounded-full object-cover"
                        alt=""
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                        {initials(order.clientName)}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold text-indigo-900">
                        {order.clientName}
                      </p>
                      <p className="text-xs text-indigo-400">Client</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-semibold text-indigo-900 mb-1.5 truncate">
                      {order.serviceTitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">

                      {cat && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                          {cat.icon} {cat.name}
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-xs text-indigo-400">
                        <FaMoneyBillWave className="text-green-500" />
                        ${order.agreedPrice ?? order.servicePrice ?? 0}
                      </span>

                      {(order.deliveryDays ?? order.deliveryTime) != null && (
                        <span className="flex items-center gap-1 text-xs text-indigo-400">
                          <FaClock className="text-indigo-400" />
                          {order.deliveryDays ?? order.deliveryTime}d delivery
                        </span>
                      )}

                    </div>
                  </div>

                  {/* Button */}
                  <button
                    disabled={isThisBusy}
                    onClick={() => markComplete(order.id)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 text-white text-xs font-semibold"
                  >
                    <FaCheckCircle className="text-white" />
                    {isThisBusy ? "Updating..." : "Mark Complete"}
                  </button>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}