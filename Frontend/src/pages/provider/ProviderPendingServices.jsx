import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getProviderServices } from "../../services/ServiceApi";
import {
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineFolder,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";

export default function ProviderPendingServices() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["providerServices", user?.id],
    queryFn: getProviderServices,
    enabled: !!user?.id,
  });
///////////////////////////////////////////////
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
              <div
                key={i}
                className="h-24 rounded-xl bg-indigo-50 animate-pulse"
              />
            ))}
          </div>
        ) : pendingServices.length === 0 ? (
          <div className="text-center py-16 bg-purple-50 border border-purple-100 rounded-xl">

            <div className="flex justify-center mb-3">
              <HiOutlineWrenchScrewdriver className="text-5xl text-purple-300" />
            </div>

            <p className="text-purple-500 font-semibold text-sm">
              No pending services
            </p>

            <p className="text-purple-300 text-xs mt-1">
              New services waiting for approval will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingServices.map((service) => (
              <div
                key={service.serviceId}
                onClick={() => navigate(`/services/${service.serviceId}`)}
                className="border border-indigo-100 rounded-2xl p-5 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
              >
                <div className="flex gap-4 items-center">

                  {/* Image */}
                  {(service.thumbnailUrl || service.images?.[0]) ? (
                    <img
                      src={service.thumbnailUrl || service.images?.[0]}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      alt={service.title}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <HiOutlineWrenchScrewdriver className="text-3xl text-purple-400" />
                    </div>
                  )}

                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-indigo-900 mb-1 group-hover:text-purple-600 transition">
                      {service.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-indigo-400">

                      <div className="flex items-center gap-1">
                        <HiOutlineCurrencyDollar className="text-base" />
                        <span>${service.price}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <HiOutlineClock className="text-base" />
                        <span>{service.deliveryTime}d</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <HiOutlineFolder className="text-base" />
                        <span>{service.category}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-4 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-600 text-xs font-semibold flex-shrink-0">
                    Pending
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