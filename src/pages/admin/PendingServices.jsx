import { useState, useEffect } from "react";
import * as adminService from "../../services/adminApi";

export default function PendingServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    adminService.getPendingServices().then(res => {
      setServices(res.data.data);
      setLoading(false);
    });
  }, []);

  const handleReview = async (id, action) => {
    setBusy(id);
    const isApprove = action === 'approve';
    try {
      await adminService.reviewService(id, isApprove);
      setServices(prev => prev.filter(s => s.serviceId !== id));
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="max-h-screen max-w-screen  bg-[#141824] text-slate-100 px-5 py-10   font-sans   rounded-3xl shadow-2xl ">

      <div className="flex justify-between items-end mb-10 border-b border-slate-800/50 pb-6">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-indigo-400 font-bold mb-1 uppercase">Admin Review Queue</p>
          <h1 className="text-4xl font-black bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">Pending Services</h1>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
          <span className="text-xs font-bold text-amber-300 tracking-wider">
            {loading ? "—" : services.length} <span className="text-[10px] font-medium text-slate-500 ml-1 uppercase">Waiting</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading queue...</div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-[#131720] border border-slate-800 rounded-3xl">
          <p className="text-slate-400 font-medium">✓ All services reviewed!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {services.map((sv) => (
            <div key={sv.serviceId} className="bg-[#131720] border border-slate-800/60 rounded-2xl p-5 hover:border-indigo-500/20 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-slate-100 text-lg mb-4">{sv.title}</h3>
                  <div className="flex gap-3 text-[11px] flex-wrap">
                    <h3 className="bg-[#0c0e14] text-xs px-3 py-1 rounded-lg text-slate-400 border border-slate-800">💰 ${sv.price}</h3>
                    <h3 className="bg-[#0c0e14] text-xs px-3 py-1 rounded-lg text-slate-400 border border-slate-800">⏱️ {sv.deliveryTime} Days</h3>
                    <h3 className="bg-[#0c0e14] text-xs px-3 py-1 rounded-lg text-indigo-400 border border-slate-800 font-bold">👤 {sv.provider?.name || "Provider"}</h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={busy === sv.serviceId}
                    onClick={() => handleReview(sv.serviceId, "approve")}
                    className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    {busy === sv.serviceId ? "..." : "Approve"}
                  </button>
                  <button
                    disabled={busy === sv.serviceId}
                    onClick={() => handleReview(sv.serviceId, "reject")}
                    className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}