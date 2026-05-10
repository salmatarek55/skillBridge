import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as adminService from "../../services/adminApi";
import { getCategoryByName } from "../../data/categories";

const categoryClass = (categoryName) => {
  const category = getCategoryByName(categoryName);
  return category.bg + " " + category.border;
};

export default function PendingServices() {
  const queryClient = useQueryClient();

  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pendingServices"],
    queryFn: async () => {
      const res = await adminService.getPendingServices();
      return res.data.data;
    },
  });

  useEffect(() => {
    if (isError) toast.error("Failed to load pending services");
  }, [isError]);

  const {
    mutate: reviewService,
    isPending: busy,
    variables,
  } = useMutation({
    mutationFn: ({ id, approve }) => adminService.reviewService(id, approve),
    onSuccess: (_, { approve }) => {
      toast.success(approve ? "Service approved ✅" : "Service rejected");
      queryClient.invalidateQueries({ queryKey: ["pendingServices"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: () => toast.error("Action failed, please try again"),
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-indigo-100 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-1">
              Admin Review Queue
            </p>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
              Pending Services
            </h1>
          </div>
          <span className="text-xs px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-semibold">
            {isLoading ? "—" : services.length} Waiting
          </span>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-purple-50/60 animate-pulse"
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16 bg-purple-50 border border-purple-100 rounded-xl">
            <p className="text-3xl mb-3">✅</p>
            <p className="text-purple-500 font-medium text-sm">
              All services reviewed!
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-indigo-50">
            {services.map((sv) => {
              const isThisBusy = busy && variables?.id === sv.id;
              return (
                <div
                  key={sv.id}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-indigo-900 mb-2">
                      {sv.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {sv.category &&
                        (() => {
                          const cat = getCategoryByName(sv.category);
                          return (
                            <span
                              className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1
      ${cat.bg} ${cat.color} ${cat.border}`}
                            >
                              <span>{cat.icon}</span>
                              {cat.name}
                            </span>
                          );
                        })()}
                      <span className="text-xs text-indigo-400">
                        💰 ${sv.price}
                      </span>
                      <span className="text-xs text-indigo-400">
                        ⏱ {sv.deliveryTime} days
                      </span>
                      <span className="text-xs text-purple-500 font-medium">
                        👤 {sv.provider?.name || sv.providerName || "Provider"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0 mt-0.5">
                    <button
                      disabled={isThisBusy}
                      onClick={() =>
                        reviewService({ id: sv.id, approve: true })
                      }
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isThisBusy ? "..." : "✓ Approve"}
                    </button>
                    <button
                      disabled={isThisBusy}
                      onClick={() =>
                        reviewService({ id: sv.id, approve: false })
                      }
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isThisBusy ? "..." : "✕ Reject"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
