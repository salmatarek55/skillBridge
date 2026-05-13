import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as adminService from "../../services/AdminApi";
import { getCategoryByName } from "../../data/categories";

import {
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineBanknotes,
  HiOutlineClock,
  HiOutlineCheck,
  HiOutlineXMark,
} from "react-icons/hi2";

export default function PendingServices() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
/////////////////////////////////////////////////////////////
  useEffect(() => {
    if (isError) toast.error("Failed to load pending services");
  }, [isError]);
/////////////////////////////////////////////////////////////
  const { mutate: reviewService, isPending: busy, variables } = useMutation({
    mutationFn: ({ id, approve }) =>
      adminService.reviewService(id, approve),
    onSuccess: (_, { approve }) => {
      toast.success(
        approve
          ? "Service approved successfully"
          : "Service rejected"
      );
      queryClient.invalidateQueries({
        queryKey: ["pendingServices"],
      });
      queryClient.invalidateQueries({
        queryKey: ["adminStats"],
      });
    },

    onError: () =>
      toast.error(
        "Action failed, please try again"
      ),
  });
///////////////////////////////////////////////////////////////
  return (
    <div className="max-w-5xl mx-auto">
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

          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-purple-50/60 animate-pulse"
              />
            ))}
          </div>

        ) : services.length === 0 ? (

          <div className="text-center py-16 bg-purple-50 border border-purple-100 rounded-xl">

            <HiOutlineCheckCircle className="text-3xl mb-3 text-green-500 mx-auto" />

            <p className="text-purple-500 font-medium text-sm">
              All services reviewed!
            </p>

          </div>

        ) : (

          <div className="grid gap-4">
            {services.map((sv) => {
              const isThisBusy =
                busy && variables?.id === sv.id;
              const cat = sv.category
                ? getCategoryByName(sv.category)
                : null;
              return (
                <div
                  key={sv.id}
                  onClick={() =>
                    navigate(
                      `/services/${sv.serviceId || sv.id}`
                    )
                  }
                  className="group bg-white border border-purple-100 rounded-2xl p-4 shadow-[0_2px_12px_rgba(99,102,241,0.08)] hover:shadow-[0_6px_24px_rgba(99,102,241,0.14)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex gap-4">
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-bold text-base text-indigo-900 group-hover:text-purple-600 transition">
                            {sv.title}
                          </h2>
                          <p className="text-xs text-purple-500 mt-1 flex items-center gap-1">
                            <HiOutlineUser className="text-sm" />
                            {sv.provider?.name ||
                              sv.providerName ||
                              "Provider"}
                          </p>
                        </div>
                        <span className="text-[10px] px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-semibold flex items-center gap-1">
                          <HiOutlineClock className="text-sm" />
                          Pending
                        </span>

                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {cat && (
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${cat.bg} ${cat.color} ${cat.border}`}
                          >
                            <span>{cat.icon}</span>
                            {cat.name}
                          </span>
                        )}
                        <span className="text-xs text-indigo-500 font-medium flex items-center gap-1">
                          <HiOutlineBanknotes className="text-sm" />
                          ${sv.price}
                        </span>
                        <span className="text-xs text-indigo-400 flex items-center gap-1">
                          <HiOutlineClock className="text-sm" />
                          {sv.deliveryTime} days
                        </span>
                      </div>

                      {/* Description */}
                      {sv.description && (
                        <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                          {sv.description}
                        </p>
                      )}

                      {/* Buttons */}
                      <div
                        className="flex gap-2 mt-4"
                        onClick={(e) => e.stopPropagation()}
                      >

                        <button
                          disabled={isThisBusy}
                          onClick={() =>
                            reviewService({
                              id: sv.id,
                              approve: true,
                            })
                          }
                          className="flex-1 py-2 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                        >

                          {isThisBusy ? (
                            "..."
                          ) : (
                            <>
                              <HiOutlineCheck className="text-sm" />
                              Approve
                            </>
                          )}

                        </button>

                        <button
                          disabled={isThisBusy}
                          onClick={() =>
                            reviewService({
                              id: sv.id,
                              approve: false,
                            })
                          }
                          className="flex-1 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                        >

                          {isThisBusy ? (
                            "..."
                          ) : (
                            <>
                              <HiOutlineXMark className="text-sm" />
                              Reject
                            </>
                          )}

                        </button>

                      </div>

                    </div>

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
