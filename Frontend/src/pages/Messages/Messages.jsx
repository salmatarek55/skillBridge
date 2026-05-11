// src/pages/Messages/Messages.jsx
import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { connectSocket, disconnectSocket } from "../../services/socketService";
import api from "../../services/axiosInstance";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

const initials = (name = "") =>
  name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";

export default function Messages() {
  const { user } = useContext(AuthContext);
  const [activePartner, setActivePartner]         = useState(null);
  const [activeRequestId, setActiveRequestId]     = useState(null);
  const [mobileView, setMobileView]               = useState("list");
  const [unreadMap, setUnreadMap]                 = useState({}); // { requestId: count }

  useEffect(() => {
    if (user?.id) connectSocket(user.id);
    return () => disconnectSocket();
  }, [user?.id]);

  // ── جيبي الـ requests ──────────────────────────────────────────
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["my-requests-messages", user?.id],
    queryFn:  async () => {
      const res = await api.get("/Requests/my");
      return res.data.data;
    },
    enabled: !!user?.id,
  });

  // ── جيبي الـ unread count لكل request ─────────────────────────
  useEffect(() => {
    if (!requests.length || !user?.id) return;

    const fetchUnreads = async () => {
      const map = {};
      await Promise.all(
        requests.map(async (req) => {
          try {
            const res = await api.get(`/Messages/conversation/${req.id}`);
            const msgs = res.data.data || [];
            map[req.id] = msgs.filter(
              (m) => Number(m.receiverId) === Number(user.id) && !m.isRead
            ).length;
          } catch {
            map[req.id] = 0;
          }
        })
      );
      setUnreadMap(map);
    };

    fetchUnreads();
    const interval = setInterval(fetchUnreads, 10000);
    return () => clearInterval(interval);
  }, [requests, user?.id]);

  const handleSelectRequest = (req) => {
    const isClient = req.clientName === user?.name;
    setActivePartner({
      id:     isClient ? req.providerId : req.clientId,
      name:   isClient ? req.providerName : req.clientName,
      avatar: "",
    });
    setActiveRequestId(req.id);
    // امسحي الـ unread لما تفتح المحادثة
    setUnreadMap((prev) => ({ ...prev, [req.id]: 0 }));
    setMobileView("chat");
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div
        className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-purple-100 overflow-hidden"
        style={{ height: "calc(100vh - 140px)", minHeight: "500px" }}
      >
        <div className="flex h-full">

          {/* ── Sidebar ── */}
          <div className={`w-full sm:w-72 flex-shrink-0 border-r border-purple-50 flex flex-col ${
            mobileView === "chat" ? "hidden sm:flex" : "flex"
          }`}>
            <div className="px-5 py-4 border-b border-purple-50">
              <p className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-0.5">
                Inbox
              </p>
              <h2 className="text-lg font-bold text-purple-900">Messages</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-xl bg-purple-50/60 animate-pulse" />
                  ))}
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <p className="text-3xl mb-2">💬</p>
                  <p className="text-sm text-purple-400">No conversations yet</p>
                </div>
              ) : (
                requests.map((req) => {
                  const isClient    = req.clientName === user?.name;
                  const partnerName = isClient ? req.providerName : req.clientName;
                  const unread      = unreadMap[req.id] || 0;

                  return (
                    <button
                      key={req.id}
                      onClick={() => handleSelectRequest(req)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-purple-50/60 transition text-left cursor-pointer ${
                        activeRequestId === req.id
                          ? "bg-purple-50 border-r-2 border-purple-500"
                          : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {initials(partnerName)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-purple-900 truncate">
                            {partnerName}
                          </p>
                          {/* ── Unread badge ── */}
                          {unread > 0 && (
                            <span className="ml-2 min-w-[20px] h-5 px-1 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {unread > 9 ? "9+" : unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-purple-400 truncate mt-0.5">
                          {req.serviceTitle}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Chat ── */}
          <div className={`flex-1 flex flex-col ${
            mobileView === "list" ? "hidden sm:flex" : "flex"
          }`}>
            {mobileView === "chat" && (
              <button
                onClick={() => setMobileView("list")}
                className="sm:hidden flex items-center gap-2 px-4 py-3 text-sm text-purple-500 border-b border-purple-50 cursor-pointer"
              >
                ← Back
              </button>
            )}
            <ChatWindow partner={activePartner} requestId={activeRequestId} />
          </div>

        </div>
      </div>
    </div>
  );
}