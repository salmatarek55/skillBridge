import React from 'react'
import { useNavigate } from 'react-router-dom';
import { cancelRequest } from "../../services/RequestApi";
import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RequestCard({request , service, onCancel}) {
  const navigate =useNavigate();
   const [cancelling, setCancelling] = useState(false);

    const  statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };


  function handleClick(){
    navigate(`/services/${service.serviceId}`);
  }

  const handleCancel = async (e) => {
    e.stopPropagation();
    if (cancelling) return;
    if (request.status !== "pending") {
      toast.error("Only pending requests can be cancelled");
      return;
    }
    setCancelling(true);
    try {
      await cancelRequest(request.id);
      toast.success("Request cancelled");
      onCancel(request.id); 
    } catch (err) {
      toast.error(err?.message || "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };
   return (
    <div className="bg-white rounded-2xl p-4 shadow-sm shadow-gray-400 flex flex-col gap-3">
      
      {/* Top */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <img
            src={service?.images?.[0]}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-semibold">{service?.title}</h2>
            <p className="text-xs text-gray-500">
              by {service?.provider?.name}
            </p>
          </div>
        </div>

         <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[request.status]}`}>
            {request.status}
          </span>
          {request.status === "pending" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              title="Cancel request"
              className="p-1.5 rounded-full text-red-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50 cursor-pointer"
            >
              <FiTrash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-600 flex justify-between">
        <span>${service?.price}</span>
        <span>{service?.deliveryTime} days</span>
      </div>

      <p className="text-xs text-gray-400">
        {new Date(request.createdAt).toLocaleDateString()}
      </p>

      {/* Actions */}
      <div className="flex gap-2 mt-2">
        <button onClick={handleClick} className="flex-1 bg-purple-500 text-white rounded-lg py-1.5 cursor-pointer text-sm">
          View Details
        </button>
        {/* navigate to chat  */}
        <button className="flex-1 border rounded-lg py-1.5 text-sm cursor-pointer">
          Contact
        </button>
      </div>
    </div>
  );
}
