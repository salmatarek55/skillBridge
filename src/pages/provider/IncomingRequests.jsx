import { useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { getProviderRequests, respondToRequest } from "../../services/RequestApi";
import { getCategoryByName } from "../../data/categories";

const initials = (name = "") =>
  name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";

export default function IncomingRequests() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ["providerRequests", user?.id],
    queryFn: () => getProviderRequests(user.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (isError) toast.error("Failed to load requests");
  }, [isError]);
              //////////////////////
  const { mutate: respond, isPending, variables } = useMutation({
    mutationFn: ({ requestId, action }) => respondToRequest(requestId, action),
    onSuccess: (_, { action }) => {
      toast.success(action === "accepted" ? "Request accepted ✅" : "Request rejected");
      queryClient.invalidateQueries({ queryKey: ["providerRequests", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["providerOrders",   user?.id] });
    },
    onError: () => toast.error("Action failed, please try again"),
  });

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
              Incoming Requests
            </h1>
          </div>
          <span className="text-xs px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-600 font-semibold">
            {isLoading ? "—" : requests.length} Pending
          </span>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-indigo-50/60 animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 bg-purple-50 border border-purple-100 rounded-xl">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-purple-400 font-medium text-sm">
              No pending requests right now.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-indigo-50">
            {requests.map((req) => {
              const isThisBusy = isPending && variables?.requestId === req.id;
              const cat = getCategoryByName(req.serviceCategory);

              return (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 py-5 first:pt-0 last:pb-0"
                >
                  {/* Client info */}
                  <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                    {req.clientAvatar ? (
                      <img
                        src={req.clientAvatar}
                        alt={req.clientName}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {initials(req.clientName)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-indigo-900 truncate">
                        {req.clientName}
                      </p>
                      <p className="text-xs text-indigo-400">Client</p>
                    </div>
                  </div>

                  {/* Service info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-indigo-900 mb-1.5 truncate">
                      {req.serviceTitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {req.serviceCategory && (
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
                          {cat.icon} {cat.name}
                        </span>
                      )}
                      <span className="text-xs text-indigo-400">💰 ${req.servicePrice}</span>
                      <span className="text-xs text-indigo-300">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      disabled={isThisBusy}
                      onClick={() => respond({ requestId: req.id, action: "accepted" })}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isThisBusy ? "..." : "✓ Accept"}
                    </button>
                    <button
                      disabled={isThisBusy}
                      onClick={() => respond({ requestId: req.id, action: "rejected" })}
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
