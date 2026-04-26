import React , { useState, useContext }  from "react";
import { useParams ,useNavigate, Link  } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createRequest } from "../../services/RequestApi";
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
import { FaLongArrowAltRight } from "react-icons/fa";
export default function ServiceDetails() {
      const navigate = useNavigate();
  const { serviceId } = useParams();
    const { user } = useContext(AuthContext);
    const [requesting, setRequesting] = useState(false); 

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

  const handleRequest = async () => {
    if (!user) {
      toast.error("You must be logged in to request a service");
      return;
    }
    if (requesting) return;
    setRequesting(true);
    try {
    await createRequest({
      serviceId,
      clientId: user.id,
      providerId: service.provider?.id,
    });
      toast.success("Request sent successfully!");
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setRequesting(false);
    }
  };

  if (isLoading) return <LoadingSpinner/>;
  if (isError || !service)
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

return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Back */}
      <button
        onClick={() => navigate("/services")}
        className="flex items-center gap-1.5 text-sm rounded-full py-2 px-3.5 cursor-pointer bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-[#002117] hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:via-purple-400 hover:to-purple-600 hover:-translate-y-0.5 transition-all duration-300 mb-6"
      >
        <FiArrowLeft />
        Back to Services
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          <div className="bg-white rounded-2xl  p-6">

            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                {service?.category}
              </span>

              <StarRating value={service.rating} />
            </div>

            <h1 className="text-xl font-bold mb-4">
              {service?.title}
            </h1>

            <div className="flex items-center gap-3">
              <img src={service?.provider?.avatar} className="w-10 h-10 rounded-full object-cover" />
              
              <div>
                <p className="text-sm font-semibold">
                  {service?.provider?.name || "Provider"}
                </p>
              </div>
            </div>

           {service?.images?.[0] && (
            <img
              src={service.images[0]}
              alt="service"
              className="rounded-xl w-full h-100 object-cover mt-5"
            />
          )}

          
          <div className="bg-white rounded-2xl border mt-4 border-gray-200 shadow-md shadow-gray-300  p-6">
            <h2 className="font-bold mb-2">About</h2>
            <p className="text-sm text-gray-600">
              {service?.description || "No description provided"}
            </p>
          </div>
          </div>

        </div>

        {/* RIGHT */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md shadow-gray-300  p-6 flex flex-col gap-4">

            <h2 className="text-2xl font-bold">
              ${service?.price ?? "N/A"}
            </h2>

            <div className="flex flex-col gap-2 text-sm">
              <span>⏱ {service?.deliveryTime || "N/A"} Days</span>
              <span>🔄 Revisions included</span>
              <span>👍 High rating</span>
            </div>

            {user && isClient(user) ? (
              <button
                onClick={handleRequest}
                disabled={requesting}
                className=" rounded-xl py-2 px-3.5 cursor-pointer bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-[#002117] hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:via-purple-400 hover:to-purple-600 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-900"
              >
                {requesting ? "Sending..." : "Request Service"}
              </button>
            ) : (
             <div className="flex gap-2.5">
                <p className=" text-gray-400 text-center mt-1.5 flex gap-1">
                Login required <FaLongArrowAltRight className="mt-1" />
              </p>
              <button
                  onClick={() => navigate("/login")}
                  className=" w-[75%]  rounded-xl py-2 px-3.5 cursor-pointer flex items-center gap-2 justify-center bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-[#002117] hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:via-purple-400 hover:to-purple-600 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-900"
              >
                     Go to Login <FaLongArrowAltRight className="mt-1" />
              </button>
             </div>
             
            )}
             <hr className="text-gray-400" />
            {/* will navigate to chat window */}
            <button className="bg-purple-100 text-purple-700 -mt-1.5 py-2 rounded-lg flex items-center justify-center gap-2 cursor-pointer  hover:text-white hover:bg-gradient-to-r hover:from-purple-400 hover:via-purple-400 hover:to-purple-500 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-900">
              <FiMessageCircle />
              Contact
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

 