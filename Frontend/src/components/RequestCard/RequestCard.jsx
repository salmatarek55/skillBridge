import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../StatusBadge/StatusBadge";
import {
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineBanknotes,
  HiOutlineUser,
  HiOutlineXMark,
  HiOutlineFlag,
  HiOutlineWrenchScrewdriver,
} from "react-icons/hi2";

export default function RequestCard({ request, service, onCancel }) {
  const navigate = useNavigate();
  const status = request.status?.toLowerCase();
  const handleCardClick = () => {
    navigate(`/services/${request.serviceId}`);
  };
  ///////////////////////////////////////////
  const handleCancel = (e) => {
    e.stopPropagation();
    onCancel?.();
  };
  ///////////////////////////////////////////
  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-indigo-100 rounded-2xl p-5 hover:shadow-lg hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    >
      <div className="flex gap-4 items-start">
        {/* Image */}
        <div className="flex-shrink-0">
          {(service.thumbnailUrl || service.images?.[0]) ? (
                    <img
                      src={service.thumbnailUrl || service.images?.[0]}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      alt={service.title}
                    />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
              <HiOutlineWrenchScrewdriver />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-sm text-indigo-900 group-hover:text-purple-600 transition line-clamp-1">
              {service?.title || request.serviceTitle || "Service"}
            </h3>
            <StatusBadge status={status} />
          </div>

          {/* Provider */}
          <div className="flex items-center gap-1.5 mb-3">
            {service?.provider?.avatar ? (
              <img
                src={service.provider.avatar}
                className="w-5 h-5 rounded-full object-cover"
                alt={service.provider.name}
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                <HiOutlineUser className="text-purple-500 text-[10px]" />
              </div>
            )}
            <span className="text-xs text-gray-500">
              {service?.provider?.name || request.providerName || "Provider"}
            </span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <HiOutlineBanknotes className="text-purple-400" />$
              {request.agreedPrice || service?.price || "—"}
            </span>
            {service?.deliveryTime && (
              <span className="flex items-center gap-1">
                <HiOutlineClock className="text-purple-400" />
                {service.deliveryTime}d delivery
              </span>
            )}
            {request.createdAt && (
              <span className="text-gray-400">
                {new Date(request.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </div>
      {status === "pending" && onCancel && (
        <div className="mt-4 pt-4 border-t border-indigo-50">
          <button
            onClick={handleCancel}
            className="w-full py-2 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs font-semibold hover:bg-red-100 transition cursor-pointer"
          >
            Cancel Request
          </button>
        </div>
      )}
    </div>
  );
}
