import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { getProviderServices, deleteService, getServiceById } from "../../services/ServiceApi";
import { getProviderRequests } from "../../services/RequestApi";
import ServiceForm from "./ServiceForm";
import {
  FaMoneyBillWave,
  FaClock,
  FaTools,
  FaLock,
  FaBell,
} from "react-icons/fa";

const STATUS_STYLE = {
  approved: "bg-green-50 text-green-600 border-green-200",
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

export default function MyServices() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [hoveredServiceId, setHoveredServiceId] = useState(null);
  const [loadingEditId, setLoadingEditId] = useState(null);
/////////////////////////////////////////////////////////////
  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["providerServices", user?.id],
    queryFn: getProviderServices,
    enabled: !!user?.id,
  });
/////////////////////////////////////////////////////////////
  const { data: allRequests = [] } = useQuery({
    queryKey: ["providerRequests", user?.id],
    queryFn: getProviderRequests,
    enabled: !!user?.id,
  });
/////////////////////////////////////////////////////////////
  useEffect(() => {
    if (isError) toast.error("Failed to load services");
  }, [isError]);
/////////////////////////////////////////////////////////////
  const requestsByService = allRequests.reduce((acc, req) => {
    if (!acc[req.serviceId]) acc[req.serviceId] = [];
    acc[req.serviceId].push(req);
    return acc;
  }, {});
/////////////////////////////////////////////////////////////
  const { mutate: handleDelete, isPending: deleting } = useMutation({
    mutationFn: () => deleteService(deleteTarget),
    onSuccess: () => {
      toast.success("Service deleted");
      queryClient.invalidateQueries({ queryKey: ["providerServices", user?.id] });
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete service"),
  });
/////////////////////////////////////////////////////////////
  const handleEditClick = async (e, serviceId) => {
    e.stopPropagation();
    setLoadingEditId(serviceId);
    try {
      const fullService = await getServiceById(serviceId);
      setSelectedService(fullService);
      setOpenModal(true);
    } catch {
      toast.error("Failed to load service details");
    } finally {
      setLoadingEditId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-indigo-100 p-6 sm:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              Provider Panel
            </p>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 via-purple-300 to-purple-600 bg-clip-text text-transparent">
              My Services
            </h1>
          </div>
          <button
            onClick={() => { setSelectedService(null); setOpenModal(true); }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-white hover:opacity-90 cursor-pointer text-sm font-semibold"
          >
            + Add New Service
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-indigo-50 animate-pulse" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-purple-50 border border-purple-100 rounded-3xl">
            <FaTools className="text-purple-500 text-5xl mx-auto mb-4" />
            <p className="text-purple-500 font-medium text-sm mb-6">
              You haven't created any services yet.
            </p>
            <button
              onClick={() => { setSelectedService(null); setOpenModal(true); }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm"
            >
              Create your first service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((sv) => {
              const serviceRequests = requestsByService[sv.serviceId] || [];
              const pendingCount = serviceRequests.length;
              const hasActiveRequests = pendingCount > 0;
              const isHovered = hoveredServiceId === sv.serviceId;
              const isEditLoading = loadingEditId === sv.serviceId;

              return (
                <div
                  key={sv.serviceId}
                  onClick={() => navigate(`/services/${sv.serviceId}`)}
                  className="group bg-gray-50 border border-purple-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition flex flex-col cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative">
                    {(sv.thumbnailUrl || sv.images?.[0]) ? (
                      <img
                        src={sv.thumbnailUrl || sv.images?.[0]}
                        className="h-52 w-full object-cover group-hover:scale-105 transition"
                        alt={sv.title}
                      />
                    ) : (
                      <div className="h-52 bg-indigo-50 flex items-center justify-center text-5xl">
                        🛠️
                      </div>
                    )}

                    {/* Pending Requests Badge */}
                    {pendingCount > 0 && (
                      <div
                        className="absolute top-3 right-3"
                        onMouseEnter={() => setHoveredServiceId(sv.serviceId)}
                        onMouseLeave={() => setHoveredServiceId(null)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-1.5 bg-white border border-amber-200 text-amber-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md cursor-default select-none">
                          <FaBell className="text-amber-400 animate-bounce" />
                          {pendingCount} pending {pendingCount === 1 ? "request" : "requests"}
                        </div>

                        {isHovered && (
                          <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-purple-100 rounded-2xl shadow-xl p-3 z-10">
                            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">
                              Waiting for you
                            </p>
                            <ul className="space-y-2">
                              {serviceRequests.slice(0, 4).map((req) => (
                                <li key={req.id} className="flex items-center gap-2">
                                  {req.clientAvatar ? (
                                    <img
                                      src={req.clientAvatar}
                                      className="w-6 h-6 rounded-full object-cover border border-purple-100"
                                      alt={req.clientName}
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 text-[10px] font-bold">
                                      {req.clientName?.charAt(0)?.toUpperCase() || "?"}
                                    </div>
                                  )}
                                  <span className="text-xs text-gray-600 truncate font-medium">
                                    {req.clientName}
                                  </span>
                                </li>
                              ))}
                              {serviceRequests.length > 4 && (
                                <li className="text-[11px] text-purple-400 font-medium pl-1">
                                  +{serviceRequests.length - 4} more...
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="text-lg font-bold mb-2">{sv.title}</h2>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-5">{sv.description}</p>

                    <div className="flex gap-2 flex-wrap mb-5 text-xs">
                      <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full flex items-center gap-1">
                        <FaMoneyBillWave /> ${sv.price}
                      </span>
                      <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full flex items-center gap-1">
                        <FaClock /> {sv.deliveryTime}d
                      </span>
                      <span className={`px-3 py-1 rounded-full border ${STATUS_STYLE[sv.status]}`}>
                        {sv.status}
                      </span>
                    </div>

                    <div className="flex gap-3 mt-auto">
                      {/* ✅ FIX: fetch full service before opening edit modal */}
                      <button
                        onClick={(e) => handleEditClick(e, sv.serviceId)}
                        disabled={isEditLoading}
                        className="flex-1 cursor-pointer bg-purple-100 text-purple-600 py-2 rounded-xl text-sm disabled:opacity-50 transition"
                      >
                        {isEditLoading ? "Loading..." : "Edit"}
                      </button>

                      <div className="flex-1 relative group/del">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!hasActiveRequests) setDeleteTarget(sv.serviceId);
                          }}
                          disabled={hasActiveRequests}
                          className={`w-full py-2 rounded-xl text-sm transition flex items-center justify-center gap-1.5
                            ${hasActiveRequests
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-red-50 text-red-600 cursor-pointer hover:bg-red-100"
                            }`}
                        >
                          {hasActiveRequests && <FaLock className="text-xs" />}
                          Delete
                        </button>

                        {hasActiveRequests && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded-xl px-3 py-2 text-center opacity-0 group-hover/del:opacity-100 transition pointer-events-none z-10">
                            Can't delete — has {pendingCount} active {pendingCount === 1 ? "request" : "requests"}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ServiceForm
        open={openModal}
        onClose={() => { setOpenModal(false); setSelectedService(null); }}
        service={selectedService}
      />

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
            <p className="mb-4 text-purple-600 text-center font-medium">
              Do you want to delete this service?
            </p>
            <div className="flex gap-3 justify-center items-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="bg-gray-100 text-purple-600 py-2 px-4 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-100 text-red-600 py-2 px-4 rounded-xl disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}