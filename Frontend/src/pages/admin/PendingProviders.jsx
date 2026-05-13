import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as adminService from "../../services/adminApi";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

export default function PendingProviders() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState("");

  const {
    data: providers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pendingProviders"],
    queryFn: async () => {
      const res = await adminService.getPendingProviders();
      return res.data.data;
    },
  });
/////////////////////////////////////////////
  useEffect(() => {
    if (isError) toast.error("Failed to load pending providers");
  }, [isError]);
/////////////////////////////////////////////
  const { mutate: reviewProvider, isPending: busy } = useMutation({
    mutationFn: ({ id, approve, note }) =>
      adminService.reviewProvider(id, approve, note),
    onSuccess: (_, { approve }) => {
      toast.success(approve ? "Provider approved ✅" : "Provider rejected");
      queryClient.invalidateQueries({ queryKey: ["pendingProviders"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setModal(null);
      setNote("");
    },
    onError: () => toast.error("Action failed, please try again"),
  });
/////////////////////////////////////////////
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-purple-100 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-1">
              Admin Review Queue
            </p>
            <h1 className="text-2xl font-bold  bg-gradient-to-r from-purple-700 via-purple-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
              Pending Providers
            </h1>
          </div>
          <span className="text-xs px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-semibold">
            {isLoading ? "—" : providers.length} Waiting
          </span>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-indigo-50/60 animate-pulse"
              />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16 bg-indigo-50 border border-indigo-100 rounded-xl">
            <HiOutlineCheckCircle className="text-3xl mb-3 text-green-500" />
            <p className="text-indigo-500 font-medium text-sm">
              All caught up! No pending applications.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-indigo-50">
            {providers.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {initials(p.name || p.fullName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-indigo-900 truncate">
                    {p.name || p.fullName}
                  </p>
                  <p className="text-xs text-indigo-400 truncate">{p.email}</p>
                </div>

                {/* Badge */}
                <span className="hidden sm:inline text-[10px] px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-semibold">
                  Pending
                </span>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    disabled={busy}
                    onClick={() => reviewProvider({ id: p.id, approve: true })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition disabled:opacity-50 cursor-pointer"
                  >
                    <HiOutlineCheck className="text-sm" />
                    Approve
                  </button>
                  <button
                    disabled={busy}
                    onClick={() =>
                      setModal({ id: p.id, name: p.name || p.fullName })
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                  >
                    <HiOutlineXMark className="text-sm" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {modal && (
        <div className="fixed inset-0 bg-purple-700/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(99,102,241,0.18)] border border-purple-100 p-7 w-full max-w-md">
            <h3 className="text-lg font-bold text-purple-900 mb-1">
              Reject {modal.name}?
            </h3>
            <p className="text-sm text-purple-400 mb-4">
              Reason for rejection (optional)
            </p>
            <textarea
              className="w-full bg-purple-50 border border-purple-200 rounded-xl p-3 text-sm text-purple-900 outline-none focus:border-purple-400 transition resize-none"
              rows="3"
              placeholder="e.g. Incomplete profile details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setModal(null);
                  setNote("");
                }}
                className="px-5 py-2 text-sm font-semibold text-purple-400 hover:text-purple-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  reviewProvider({ id: modal.id, approve: false, note })
                }
                className="px-6 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition cursor-pointer"
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
