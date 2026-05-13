import React, { useState, useContext } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createRequest, getClientRequests, cancelRequest, getServiceRatings } from "../../services/RequestApi";
import { getServiceById } from "../../services/ServiceApi";
import { AuthContext } from "../../context/AuthContext";
import { isClient, isProvider, isAdmin } from "../../Roles/Roles";
import toast from "react-hot-toast";
import StarRating from "../../components/StarRating/StarRating";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import PortfolioGallery from "../../components/PortfolioGallery/PortfolioGallery";
import {
  FiArrowLeft,
  FiMessageCircle,
  FiClock,
  FiRefreshCw,
  FiThumbsUp,
  FiUser,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

export default function ServiceDetails() {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const {
    data: service,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => getServiceById(serviceId),
    enabled: !!serviceId,
  });
//////////////////////////////////////////////////////////////
  const { data: myRequests = [] } = useQuery({
    queryKey: ["clientRequests", user?.id],
    queryFn: getClientRequests,
    enabled: !!user && isClient(user),
  });
//////////////////////////////////////////////////////////////
  const { data: reviews = [] } = useQuery({
    queryKey: ["serviceRatings", serviceId],
    queryFn: () => getServiceRatings(serviceId),
    enabled: !!serviceId,
  });
//////////////////////////////////////////////////////////////
  const existingRequest = myRequests.find(
    (r) => String(r.serviceId) === String(serviceId)
  );
  const requestStatus = existingRequest?.status?.toLowerCase();
//////////////////////////////////////////////////////////////
  const { mutate: doRequest, isPending: requesting } = useMutation({
    mutationFn: () =>
      createRequest({
        serviceId,
        clientId: user.id,
        providerId: service?.provider?.id,
        agreedPrice: service?.price || 0,
      }),
    onSuccess: () => {
      toast.success("Request sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["clientRequests", user?.id] });
    },
    onError: (err) => toast.error(err?.message || "Something went wrong"),
  });
//////////////////////////////////////////////////////////////
  const { mutate: doCancel, isPending: cancelling } = useMutation({
    mutationFn: () => cancelRequest(existingRequest.id),
    onSuccess: () => {
      toast.success("Request cancelled");
      queryClient.invalidateQueries({ queryKey: ["clientRequests", user?.id] });
    },
    onError: () => toast.error("Failed to cancel request"),
  });
//////////////////////////////////////////////////////////////
  if (isLoading) return <LoadingSpinner />;
  if (isError || !service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-3">
            {error?.message || "Could not load service."}
          </p>
          <Link to="/services" className="text-sm text-indigo-600 hover:underline">
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }
//////////////////////////////////////////////////////////////
  const renderActionButton = () => {
    if (user && (isProvider(user) || isAdmin(user))) return null;

    if (!user) {
      return (
        <div className="flex flex-col gap-2">
          <p className="text-gray-400 text-sm">Login required</p>
          <button
            onClick={() => navigate("/login")}
            className="rounded-xl py-2 px-3.5 cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-[#002117] hover:text-white hover:from-purple-500 hover:to-purple-600 transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      );
    }

    if (requestStatus === "accepted" || requestStatus === "completed") {
      return (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 rounded-xl py-2 px-4 text-sm font-medium">
          <FiCheckCircle className="text-green-500" />
          {requestStatus === "accepted" ? "Request Accepted" : "Service Completed"}
        </div>
      );
    }

    if (requestStatus === "pending") {
      return (
        <button
          onClick={() => doCancel()}
          disabled={cancelling}
          className="rounded-xl py-2 px-3.5 cursor-pointer flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all duration-300 disabled:opacity-50 text-sm font-medium"
        >
          <FiXCircle />
          {cancelling ? "Cancelling..." : "Cancel Request"}
        </button>
      );
    }

    return (
      <button
        onClick={() => doRequest()}
        disabled={requesting}
        className="rounded-xl py-2 px-3.5 cursor-pointer bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-[#002117] hover:text-white hover:from-purple-500 hover:to-purple-600 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
      >
        {requesting ? "Sending..." : "Request Service"}
      </button>
    );
  };
//////////////////////////////////////////////////////////////
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm rounded-full py-2 px-3.5 cursor-pointer bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-[#002117] hover:text-white hover:from-purple-500 hover:to-purple-600 hover:-translate-y-0.5 transition-all duration-300 mb-6"
      >
        <FiArrowLeft />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                {service?.category}
              </span>
              <StarRating value={service.rating} />
            </div>

            <h1 className="text-xl font-bold mb-4">{service?.title}</h1>

            <div className="flex items-center gap-3 mb-5">
              {service?.provider?.avatar ? (
                <img
                  src={service.provider.avatar}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="provider"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                  <FiUser />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">
                  {service?.provider?.name || "Provider"}
                </p>
              </div>
            </div>

            <PortfolioGallery images={service?.images || []} />

            {/* About */}
            <div className="bg-white rounded-2xl border mt-4 border-gray-200 shadow-md p-6">
              <h2 className="font-bold mb-2">About</h2>
              <p className="text-sm text-gray-600">
                {service?.description || "No description provided"}
              </p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 mt-4">
              <h2 className="font-bold mb-4 text-lg">
                Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h2>

              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  No reviews yet
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                          {review.clientName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{review.clientName}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <StarRating value={review.ratingValue} />
                      </div>
                      {review.reviewText && (
                        <p className="text-sm text-gray-600 ml-11">
                          {review.reviewText}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 flex flex-col gap-4">

            <h2 className="text-2xl font-bold">${service?.price ?? "N/A"}</h2>

            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FiClock />
                {service?.deliveryTime || "N/A"} Days
              </span>
              <span className="flex items-center gap-2">
                <FiRefreshCw />
                Revisions included
              </span>
              <span className="flex items-center gap-2">
                <FiThumbsUp />
                High rating
              </span>
            </div>

            {renderActionButton()}

            <hr className="text-gray-300" />

            <button onClick={() => navigate("/messages")} className="bg-purple-100 text-purple-700 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer hover:text-white hover:from-purple-400 hover:to-purple-500 hover:bg-gradient-to-r transition-all duration-300">
              <FiMessageCircle />
              Contact

            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

 