import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import {
  getClientRequests,
  cancelRequest,
  rateService,
} from "../../services/RequestApi";
import StarRating from "../../components/StarRating/StarRating";
import RequestCard from "../../components/RequestCard/RequestCard";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import {
  HiOutlineLockClosed,
  HiOutlineNoSymbol,
  HiOutlineInbox,
  HiOutlineStar,
} from "react-icons/hi2";

const STATUS_TABS = ["all", "pending", "accepted", "completed", "rejected"];

export default function MyRequests() {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [ratingModal, setRatingModal] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  //////////////////////////////
  const {
    data: requests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clientRequests", user?.id],

    queryFn: getClientRequests,

    enabled: !!user?.id,
  });
  //////////////////////////////
  const { mutate: cancel } = useMutation({
    mutationFn: (id) => cancelRequest(id),
    onSuccess: () => {
      toast.success("Request cancelled");

      queryClient.invalidateQueries({
        queryKey: ["clientRequests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-requests-messages"],
      });
    },

    onError: () => toast.error("Failed to cancel request"),
  });
  //////////////////////////////
  const { mutate: submitRating, isPending: rating } = useMutation({
    mutationFn: ({ requestId, stars }) => rateService(requestId, stars),

    onSuccess: () => {
      toast.success("Rating submitted ⭐");

      queryClient.invalidateQueries({
        queryKey: ["clientRequests", user?.id],
      });

      setRatingModal(null);

      setRatingValue(0);
    },

    onError: () => toast.error("Failed to submit rating"),
  });
  //////////////////////////////
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="bg-white border border-indigo-100 rounded-3xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
            <HiOutlineLockClosed className="text-4xl text-indigo-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Login Required
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Please login first to view your requests
          </p>

          <Link
            to="/login"
            className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-3 rounded-xl transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "client") {
    return (
      <div className="flex justify-center items-center min-h-[60vh] px-4">
        <div className="bg-white border border-red-100 rounded-3xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-100 flex items-center justify-center mb-4">
            <HiOutlineNoSymbol className="text-4xl text-red-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Only clients can access this page
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-6 py-3 rounded-xl transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-20">Failed to load requests</p>
    );
  }

  const filtered =
    activeTab === "all"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-indigo-100 p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
              Client Panel
            </p>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-400 to-purple-700 bg-clip-text text-transparent">
              My Requests
            </h1>
          </div>

          <span className="text-xs px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-600 font-semibold">
            {requests.length} Total
          </span>
        </div>

        <div className="flex gap-1 flex-wrap bg-indigo-50 p-1 rounded-xl border border-indigo-100 w-fit">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-500 via-purple-400 to-purple-600 text-white shadow-sm"
                  : "text-purple-400 hover:text-purple-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex justify-center items-center min-h-[50vh] px-4">
          <div className="bg-white border border-indigo-100 rounded-[28px] shadow-[0_10px_40px_rgba(99,102,241,0.08)] p-10 text-center max-w-lg w-full relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-inner mb-6">
                <HiOutlineInbox className="text-5xl text-purple-400" />
              </div>

              <h2 className="text-3xl font-bold text-purple-400 mb-3">
                No Requests Yet
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
                You haven't requested any services yet. Start exploring and find
                the perfect service.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/services"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-6 py-3 rounded-xl transition shadow-md hover:shadow-lg"
                >
                  Explore Services
                </Link>

                <Link
                  to="/"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-6 py-3 rounded-xl transition"
                >
                  Back Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((req) => (
            <div key={req.id} className="relative">
              <RequestCard
                request={req}
                service={{
                  serviceId: req.serviceId,
                  title: req.serviceTitle,
                  image: req.serviceImage,
                  category: req.serviceCategory,
                  price: req.agreedPrice,
                  deliveryTime: req.deliveryDays,
                  provider: {
                    name: req.providerName,
                    avatar: req.providerAvatar,
                  },
                }}
                onCancel={() => cancel(req.id)}
              />

              {req.status === "completed" && !req.rating && (
                <button
                  onClick={() => {
                    setRatingModal(req);

                    setRatingValue(0);
                  }}
                  className="mt-2 w-full py-2 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold hover:bg-yellow-100 transition cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2">
                    <HiOutlineStar className="text-base" />
                    <span>Rate this service</span>
                  </div>
                </button>
              )}

              {req.status === "completed" && req.rating && (
                <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <span className="text-xs text-yellow-600 font-medium">
                    Your rating:
                  </span>

                  <StarRating value={req.rating} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {ratingModal && (
        <div className="fixed inset-0 bg-indigo-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(99,102,241,0.18)] border border-indigo-100 p-7 w-full max-w-sm text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-yellow-100 flex items-center justify-center mb-3">
              <HiOutlineStar className="text-3xl text-yellow-500" />
            </div>

            <h3 className="text-lg font-bold text-indigo-900 mb-1">
              Rate this service
            </h3>

            <p className="text-sm text-indigo-400 mb-5 truncate">
              {ratingModal.serviceTitle}
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingValue(star)}
                  className={`text-3xl transition cursor-pointer ${
                    star <= ratingValue ? "text-yellow-400" : "text-gray-200"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setRatingModal(null);

                  setRatingValue(0);
                }}
                className="px-5 py-2 text-sm font-semibold text-indigo-400 hover:text-indigo-700 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                disabled={ratingValue === 0 || rating}
                onClick={() =>
                  submitRating({
                    requestId: ratingModal.id,
                    stars: ratingValue,
                  })
                }
                className="px-7 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
              >
                {rating ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
