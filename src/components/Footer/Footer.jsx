import React from 'react'

export default function Footer() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 mt-6">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Brand */}
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-300 to-purple-500 bg-clip-text text-transparent">
            SkillBridge
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            A freelance marketplace connecting businesses with top professionals.
          </p>
        </div>

        {/* Platform */}
        <div className="flex flex-col gap-2 text-sm text-slate-500">
          <h3 className="text-slate-300 font-semibold mb-1">Platform</h3>
          <span className="hover:text-indigo-500 transition cursor-pointer">Browse Services</span>
          <span className="hover:text-indigo-500 transition cursor-pointer">Find Experts</span>
          <span className="hover:text-indigo-500 transition cursor-pointer">Post Project</span>
          <span className="hover:text-indigo-500 transition cursor-pointer">How it Works</span>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-2 text-sm text-slate-500">
          <h3 className="text-slate-300 font-semibold mb-1">Company</h3>
          <span className="hover:text-indigo-500 transition cursor-pointer">About</span>
          <span className="hover:text-indigo-500 transition cursor-pointer">Careers</span>
          <span className="hover:text-indigo-500 transition cursor-pointer">Privacy</span>
          <span className="hover:text-indigo-500 transition cursor-pointer">Terms</span>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-2 text-sm text-slate-500">
          <h3 className="text-slate-300 font-semibold mb-1">Support</h3>
          <span className="hover:text-indigo-500 transition cursor-pointer">Help Center</span>
          <span className="hover:text-indigo-500 transition cursor-pointer">Contact</span>
          <span className="hover:text-indigo-500 transition cursor-pointer">Trust & Safety</span>
          <span className="hover:text-indigo-500 transition cursor-pointer">Status</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 mt-4">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-slate-500">

          <p>© {new Date().getFullYear()} SkillBridge. All rights reserved.</p>

          <div className="flex gap-4">
            <span className="hover:text-indigo-500 cursor-pointer transition">Privacy</span>
            <span className="hover:text-indigo-500 cursor-pointer transition">Terms</span>
            <span className="hover:text-indigo-500 cursor-pointer transition">Cookies</span>
          </div>

        </div>
      </div>
    </div>
  );
}
