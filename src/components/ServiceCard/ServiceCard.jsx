import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import StarRating from "../StarRating/StarRating";
import toast from "react-hot-toast";

export default function ServiceCard({ service }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  // card click open service details
  const handleCardClick = () => {
    navigate(`/services/${service.serviceId}`);
  };

  // request service if logged in
 const handleRequest = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to request this service");
      navigate("/login");
      return;
    }
    toast.success("Request flow will be implemented soon");
  };

 return (
   <div
      onClick={handleCardClick}
      className="group bg-white/70 backdrop-blur-md border border-gray-200 rounded-xl shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* IMAGE */}
      <div className="relative h-40 w-full">
        <img
          src={service.images?.[0]}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded-full text-xs">
          ⭐ {service.rating}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2">
        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full w-fit">
          {service.category}
        </span>

        <h3 className="font-semibold text-sm line-clamp-2">
          {service.title}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2">
          {service.description}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-gray-800">
            ${service.price}
          </span>

          <StarRating value={service.rating} />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleRequest}
          className={`mt-3 w-full rounded-full py-2 font-semibold transition-all duration-300 cursor-pointer
            ${
              isLoggedIn
                ? "bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-[#002117]/80 hover:opacity-90 transition disabled:opacity-60"
                : "bg-purple-300 text-black hover:bg-gray-400"
            }
          `}
        >
          Request Service
        </button>
      </div>
    </div>
  );
}
