import React , { useState, useContext }  from "react";
import { useParams ,useNavigate, Link  } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "../../services/ServiceApi";
import { AuthContext } from './../../context/AuthContext';
import { isClient } from './../../Roles/Roles';
import toast from "react-hot-toast";
import StarRating from "../../components/StarRating/StarRating";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {
  FiArrowLeft,
  FiClock,
  FiRefreshCw,
  FiThumbsUp,
  FiTag,
  FiDollarSign,
  FiSend,
  FiMessageCircle,
  FiUser,
} from "react-icons/fi";

export default function ServiceDetails() {
  const { serviceId } = useParams();

  const {
    data: service,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => getServiceById(serviceId),
  });

  if (isLoading) return <LoadingSpinner/>;
  if (isError || !service) return <p>Error loading service</p>;

return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold">{service.title}</h1>

      <img
        src={service.images?.[0]}
        className="w-full h-80 object-cover rounded-xl mt-4"
      />

      <div className="flex justify-between mt-4">
        <span className="font-bold">${service.price}</span>
        <StarRating value={service.rating} />
      </div>

      <p className="mt-4 text-gray-600">{service.description}</p>

      <div className="mt-4 text-sm text-gray-500">
        Provider: {service.provider?.name}
      </div>

      <div className="text-xs text-gray-400 mt-2">
        Created At: {service.createdAt || "N/A"}
      </div>

    </div>
  );
}
