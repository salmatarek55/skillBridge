import React from 'react'
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiClock, FiLogOut } from "react-icons/fi";

export default function AccountPending() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
    const handleLogout = () => {
    logout();
    navigate("/login");
  };
return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

        {/* Icon */}
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiClock className="text-amber-500 text-2xl" />
        </div>

        {/* Text */}
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Account Under Review
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          Hi <span className="font-semibold text-gray-700">{user?.name}</span>,
          your provider account has been submitted successfully.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Our admin team will review your application and approve it shortly. 
          You'll be able to access your dashboard once approved.
        </p>

        {/* Steps */}
        <div className="flex justify-center gap-6 mb-8 text-xs text-gray-400">
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">✓</div>
            <span>Registered</span>
          </div>
          <div className="h-px w-8 bg-gray-200 mt-3.5" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center font-bold">⏳</div>
            <span>Reviewing</span>
          </div>
          <div className="h-px w-8 bg-gray-200 mt-3.5" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold">🔒</div>
            <span>Approved</span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mx-auto text-sm text-red-400 hover:text-red-600 transition cursor-pointer"
        >
          <FiLogOut />
          Logout and come back later
        </button>

      </div>
    </div>
  );
}
