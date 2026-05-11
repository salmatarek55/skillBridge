import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { getProviderServices } from "../../services/ServiceApi";

export default function ProviderPendingServices() {
  const { user } = useContext(AuthContext);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["providerServices", user?.id],
    queryFn: getProviderServices,
    enabled: !!user?.id,
  });

  const pendingServices = services.filter(
    (s) => s.status?.toLowerCase().trim() === "pending"
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-indigo-100 p-6 sm:p-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              Provider Panel
            </p>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-purple-300 to-purple-600 bg-clip-text text-transparent">
              Pending Services
            </h1>
          </div>
          <span className="text-xs px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-600 font-semibold">
            {pendingServices.length} Pending
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-indigo-50 animate-pulse" />
            ))}
          </div>
        ) : pendingServices.length === 0 ? (
          <div className="text-center py-16 bg-purple-50 border border-purple-100 rounded-xl">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-purple-500 font-semibold text-sm">No pending services</p>
            <p className="text-purple-300 text-xs mt-1">New services waiting for approval will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingServices.map((service) => (
              <div key={service.serviceId} className="border border-indigo-100 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex gap-4 items-center">

                  {/* Image */}
                  {(service.thumbnailUrl || service.images?.[0]) ? (
                    <img
                      src={service.thumbnailUrl || service.images?.[0]}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-purple-50 flex items-center justify-center text-2xl flex-shrink-0">
                      🛠️
                    </div>
                  )}

                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-indigo-900 mb-1">{service.title}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-indigo-400">
                      <span>💰 ${service.price}</span>
                      <span>⏱ {service.deliveryTime}d</span>
                      <span>📁 {service.category}</span>
                    </div>
                  </div>

                  <span className="px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs font-semibold flex-shrink-0">
                    ⏳ Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}