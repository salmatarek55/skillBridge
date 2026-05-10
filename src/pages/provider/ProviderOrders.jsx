import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { getProviderOrders, completeOrder } from "../../services/RequestApi";
import { getCategoryByName } from "../../data/categories";

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

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["providerOrders", user?.id],
    queryFn: () => getProviderOrders(user.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (isError) toast.error("Failed to load orders");
  }, [isError]);

  const activeOrders = orders.filter((o) => o.status === "accepted");

  const completedOrders = orders.filter((o) => o.status === "completed");

  const totalValue = activeOrders.reduce(
    (sum, o) => sum + (o.servicePrice || 0),
    0,
  );

  const {
    mutate: markComplete,
    isPending,
    variables,
  } = useMutation({
    mutationFn: (requestId) => completeOrder(requestId),
    onSuccess: () => {
      toast.success("Order marked as completed 🎉");
      queryClient.invalidateQueries({ queryKey: ["providerOrders", user?.id] });
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

          {!isLoading && orders.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 font-semibold">
                {activeOrders.length} Active
              </span>
              <span className="text-xs px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-600 font-semibold">
                💰 ${totalValue}
              </span>
              <span className="text-xs px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 font-semibold">
                ✅ {completedOrders.length} Completed
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
                className="h-28 rounded-xl bg-indigo-50/60 animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-purple-50 border border-purple-100 rounded-xl">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-purple-400 font-medium text-sm">
              No active orders at the moment.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-indigo-50">
            {activeOrders.map((order) => {
              const isThisBusy = isPending && variables === order.id;
              const cat = getCategoryByName(order.serviceCategory);

              return (
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {initials(order.clientName)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-indigo-900 truncate">
                        {order.clientName}
                      </p>
                     <p className="text-xs text-indigo-400">Client</p>
                    </div>
                  </div>

                  {/* Order info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-indigo-900 mb-1.5 truncate">
                      {order.serviceTitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {order.serviceCategory && (
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}
                        >
                          {cat.icon} {cat.name}
                        </span>
                      )}
                      <span className="text-xs text-indigo-400">
                        💰 ${order.servicePrice}
                      </span>
                      <span className="text-xs text-indigo-400">
                        ⏱ {order.deliveryTime}d delivery
                      </span>
                      <span className="text-xs text-indigo-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Mark complete */}
                  {order.status === "completed" ? (
                    <div className="px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
                      ✓ Completed
                    </div>
                  ) : (
                    <button
                      disabled={isThisBusy}
                      onClick={() => markComplete(order.id)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 text-white text-xs font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isThisBusy ? "Updating..." : "✓ Mark Complete"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
