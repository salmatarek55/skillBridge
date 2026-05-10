import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { cancelRequest } from "../../services/RequestApi";
import { FiTrash2, FiMessageCircle, FiExternalLink } from "react-icons/fi";
import { getCategoryByName } from "../../data/categories";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   cls: "bg-amber-50  text-amber-600  border-amber-200"  },
  accepted:  { label: "Accepted",  cls: "bg-green-50  text-green-600  border-green-200"  },
  rejected:  { label: "Rejected",  cls: "bg-red-50    text-red-600    border-red-200"    },
  completed: { label: "Completed", cls: "bg-purple-50 text-purple-600 border-purple-200" },
};

export default function RequestCard({request , service, onCancel}) {
  const navigate =useNavigate();
   const queryClient  = useQueryClient();
  const statusCfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
  const cat       = getCategoryByName(service?.category);
  const imgSrc = service?.images?.[0] || service?.provider?.avatar || null;

 const { mutate: cancel, isPending: cancelling } = useMutation({
    mutationFn: () => cancelRequest(request.id),
    onSuccess: () => {
      toast.success("Request cancelled");
      onCancel?.(request.id);
      queryClient.invalidateQueries({ queryKey: ["clientRequests"] });
    },
    onError: (err) => toast.error(err?.message || "Failed to cancel"),
  });
  ///////////////////////////////////////////////////////////
  function handleClick(){
    navigate(`/services/${service.serviceId}`);
  }
///////////////////////////////////////////////
  const handleCancel = (e) => {
    e.stopPropagation();
    if (request.status !== "pending") {
      toast.error("Only pending requests can be cancelled");
      return;
    }
    cancel();
  };
   return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-[0_2px_16px_rgba(99,102,241,0.08)] p-4 flex flex-col gap-3 hover:shadow-[0_4px_24px_rgba(99,102,241,0.13)] transition-all duration-200">
 
      {/* ── Top row ── */}
      <div className="flex items-start justify-between gap-3">
 
        {/* Image + title */}
        <div className="flex items-center gap-3 min-w-0">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={service?.title}
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-purple-50"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl flex-shrink-0">
              {cat.icon}
            </div>
          )}
 
          <div className="min-w-0">
            <h2 className="font-semibold text-sm text-black truncate leading-snug">
              {service?.title || "Unknown Service"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              by {service?.provider?.name || "Provider"}
            </p>
          </div>
        </div>
 
        {/* Status + cancel */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusCfg.cls}`}>
            {statusCfg.label}
          </span>
          {request.status === "pending" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              title="Cancel request"
              className="p-1.5 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50 cursor-pointer"
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      </div>
 
      {/* ── Info row ── */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Category badge */}
        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${cat.bg} ${cat.color} ${cat.border}`}>
          {cat.icon} {cat.name}
        </span>
 
        <span className="text-xs text-purple-500 font-semibold">
          💰 ${service?.price}
        </span>
 
        {service?.deliveryTime > 0 && (
          <span className="text-xs text-purple-400">
            ⏱ {service.deliveryTime} days
          </span>
        )}
 
        <span className="text-xs text-purple-300 ml-auto">
          {new Date(request.createdAt).toLocaleDateString()}
        </span>
      </div>
 
      {/* ── Actions ── */}
      <div className="flex gap-2 pt-1 border-t border-purple-50">
        <button
          onClick={() => navigate(`/services/${service?.serviceId}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold hover:opacity-90 transition cursor-pointer"
        >
          <FiExternalLink size={13} />
          View Details
        </button>
 
        <button
          onClick={() => navigate("/messages")}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-purple-200 text-purple-600 text-xs font-semibold hover:bg-purple-50 transition cursor-pointer"
        >
          <FiMessageCircle size={13} />
          Contact
        </button>
      </div>
    </div>
  );
}