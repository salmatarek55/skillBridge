import { useState, useEffect } from "react";
import * as adminService from "../../services/adminApi";

const initials = (name = "") =>
  name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";

export default function PendingProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [modal, setModal] = useState(null); 
  const [note, setNote] = useState("");   
  const [toast, setToast] = useState(null); 

  useEffect(() => {
    adminService.getPendingProviders().then(res => {
      setProviders(res.data.data);
      setLoading(false);
    });
  }, []);

  const handleAction = async (id, action) => {
    setBusy(id);
    const isApprove = action === "approve";
    
    try {
      await adminService.reviewProvider(id, isApprove);
      setProviders(prev => prev.filter(p => p.id !== id));
      setToast({ msg: isApprove ? "Provider Approved!" : "Provider Rejected", type: "success" });
    } catch (err) {
      console.error("Error reviewing provider:", err);
      setToast({ msg: "Action failed", type: "error" });
    } finally {
      setBusy(null);
      setModal(null);
      setNote("");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="max-h-screen max-w-screen  bg-[#141824] text-slate-100 px-5 py-10   font-sans   rounded-3xl shadow-2xl ">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl border shadow-2xl z-50 transition-all ${
          toast.type === "success" ? "bg-emerald-900 border-emerald-500 text-emerald-200" : "bg-red-900 border-red-500 text-red-200"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-end mb-10 border-b border-slate-800/50 pb-6">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-indigo-400 font-bold mb-1 uppercase">Admin Review Queue</p>
          <h1 className="text-4xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent tracking-tight">
            Pending Providers
          </h1>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-xs font-bold text-amber-300 tracking-wider">
            {loading ? "—" : providers.length} <span className="text-[10px] font-medium text-slate-500 ml-1 uppercase">Waiting</span>
          </span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-24 bg-slate-800/20 animate-pulse rounded-2xl" />)}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 bg-[#131720] border border-slate-800 rounded-3xl">
          <div className="text-4xl mb-4 text-emerald-500">✓</div>
          <p className="text-slate-400 font-medium">All caught up! No pending applications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map((p) => (
            <div key={p.id} className="bg-[#131720] border border-slate-800/50 rounded-2xl p-5 flex items-center gap-5 transition-all hover:border-indigo-500/30 hover:bg-[#161b27] group">
              <div className="shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg">
                  {initials(p.name || p.fullName)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-100 text-lg group-hover:text-indigo-300 transition-colors">{p.name || p.fullName}</h3>
                <p className="text-xs text-slate-500 mb-1">{p.email}</p>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">ID: {p.id}</span>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={busy === p.id}
                  onClick={() => handleAction(p.id, "approve")}
                  className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                >
                  {busy === p.id ? "..." : "Approve"}
                </button>
                <button
                  disabled={busy === p.id}
                  onClick={() => setModal({ id: p.id, name: p.name || p.fullName })}
                  className="bg-red-500/10 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[#131720] border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Reject {modal.name}?</h3>
            <p className="text-sm text-slate-400 mb-6">Reason for rejection (optional):</p>
            <textarea
              className="w-full bg-[#0c0e14] border border-slate-800 rounded-xl p-4 text-slate-200 text-sm outline-none focus:border-indigo-500 transition-all"
              rows="3"
              placeholder="e.g. Incomplete profile details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setModal(null)} className="px-5 py-2 text-sm font-semibold text-slate-500 hover:text-white">Cancel</button>
              <button
                onClick={() => handleAction(modal.id, "reject")}
                className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-all"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}