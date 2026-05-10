import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Notfound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-5 font-sans relative overflow-hidden bg-gradient-to-r from-[oklch(93%_0.034_272.788)] to-[oklch(94.6%_0.033_307.174)]">

      <div className="text-center z-10">
        <div className="relative inline-block">
          <h1 className="text-[150px] md:text-[200px] font-black text-[oklch(27.9%_0.041_260.031)] opacity-20 leading-none select-none tracking-tighter">
            404
          </h1>
        </div>

        <div className="mt-4">
          <h2 className="text-3xl font-black text-[oklch(67.3%_0.182_276.935)] mb-3 tracking-tight">
            Page Not Found

          </h2>
          <p className="text-[oklch(44.6%_0.043_257.281)] max-w-sm mx-auto text-sm font-medium leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          {/* Button: Back to Home Page */}
          <Link
            to="/"
            className="group flex items-center gap-2 px-10 py-4 bg-[oklch(51.1%_0.262_276.966)] hover:bg-[oklch(45.7%_0.24_277.023)] text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 w-full sm:w-auto"
          >
            <span>🏠</span>
            Back to Home Page
          </Link>

          {/* Button: Go Back (Navigate -1) */}
          <button
            onClick={() => navigate(-1)}
            className="px-10 py-4 bg-white/50 backdrop-blur-md border border-[oklch(86.9%_0.022_252.894)] text-[oklch(27.9%_0.041_260.031)] font-bold rounded-2xl hover:bg-white/80 transition-all w-full sm:w-auto"
          >
            Go Back
          </button>
        </div>
      </div>

      <div className="absolute   bg-[oklch(67.3%_0.182_276.935)] opacity-10 rounded-full blur-[120px] -z-0 animate-pulse"></div>
      <div className="absolute  bg-[oklch(71.4%_0.203_305.504)] opacity-10 rounded-full blur-[120px] -z-0"></div>
    </div>
  );
}