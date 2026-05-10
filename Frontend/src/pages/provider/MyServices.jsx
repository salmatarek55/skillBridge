import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { getProviderServices, deleteService } from "../../services/ServiceApi";

import ServiceForm from "./ServiceForm";

const STATUS_STYLE = {
  approved: "bg-green-50 text-green-600 border-green-200",
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
};

export default function MyServices() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [openModal, setOpenModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    data: services = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["providerServices", user?.id],
    queryFn: getProviderServices,
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (isError) toast.error("Failed to load services");
  }, [isError]);

  const { mutate: handleDelete, isPending: deleting } = useMutation({
    mutationFn: () => deleteService(deleteTarget),

    onSuccess: () => {
      toast.success("Service deleted");
      queryClient.invalidateQueries({
        queryKey: ["providerServices", user?.id],
      });
      setDeleteTarget(null);
    },

    onError: () => toast.error("Failed to delete service"),
  });

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
            onClick={() => {
              setSelectedService(null);
              setOpenModal(true);
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-white hover:opacity-90 cursor-pointer text-sm font-semibold"
          >
            + Add New Service
          </button>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-indigo-50 animate-pulse"
              />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-purple-50 border border-purple-100 rounded-3xl">
            <p className="text-5xl mb-4">💼</p>

            <p className="text-purple-500 font-medium text-sm mb-6">
              You haven't created any services yet.
            </p>

            <button
              onClick={() => {
                setSelectedService(null);
                setOpenModal(true);
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm"
            >
              Create your first service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((sv) => (
              <div
                key={sv.serviceId}
                className="group bg-gray-50 border border-purple-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition flex flex-col"
              >
                {/* Image */}
                {(sv.thumbnailUrl || sv.images?.[0]) ? (
                  <img
                    src={sv.thumbnailUrl || sv.images?.[0]}
                    className="h-52 w-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="h-52 bg-indigo-50 flex items-center justify-center text-5xl">
                    🛠️
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold  mb-2">{sv.title}</h2>

                  <p className="text-sm text-gray-500 line-clamp-3 mb-5">
                    {sv.description}
                  </p>

                  <div className="flex gap-2 flex-wrap mb-5 text-xs">
                    <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
                      💰 ${sv.price}
                    </span>

                    <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full">
                      ⏱ {sv.deliveryTime}d
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full border ${STATUS_STYLE[sv.status]}`}
                    >
                      {sv.status}
                    </span>
                    {sv.status === "pending" && (
                      <p className="text-[11px] text-amber-500 font-medium">
                        Waiting for admin approval
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => {
                        setSelectedService(sv);
                        setOpenModal(true);
                      }}
                      className="flex-1 cursor-pointer bg-purple-100 text-purple-600 py-2 rounded-xl text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setDeleteTarget(sv.serviceId)}
                      className="flex-1 cursor-pointer bg-red-50 text-red-600 py-2 rounded-xl text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <ServiceForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        service={selectedService}
      />

      {/* Delete modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl">
            <p className="mb-4 text-purple-600">
              Do you want to delete this service?
            </p>

            <div className="flex gap-3 justify-content-center items-center">
              <button
                onClick={() => setDeleteTarget(null)}
                className="bg-gray-100 text-purple-600 py-2 px-4 rounded-xl cursor-pointer hover:-translate-y-0.5 duration-300 transation-all "
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="  bg-red-100 text-red-600 py-2 px-4 rounded-xl cursor-pointer hover:bg-red-200 hover:-translate-y-0.5 duration-300 transation-all disabled:cursor-not-allowed disabled:bg-red-50 disabled:text-red-300"
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