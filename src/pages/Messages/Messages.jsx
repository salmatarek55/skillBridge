import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { getConversations } from "../../services/MessageApi";
import { connectSocket, disconnectSocket } from "../../services/socketService";
import { users } from "../../data/users";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

const initials = (name = "") =>
  name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";

export default function Messages() {
  const { user } = useContext(AuthContext);
  const [activePartner, setActivePartner] = useState(null);
  const [mobileView, setMobileView] = useState("list"); 

///////////////////////////////////////////////////
  useEffect(() => {
    if (user?.id) connectSocket(user.id);
    return () => disconnectSocket();
  }, [user?.id]);

///////////////////////////////////////////////////
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn:  () => getConversations(user.id),
    enabled:  !!user?.id,
    refetchInterval: 5000,
  });
///////////////////////////////////////////////////
  const handleSelectPartner = (conv) => {
    const partnerUser = users.find((u) => u.id === conv.partnerId);
    setActivePartner({
      id:     conv.partnerId,
      name:   conv.partnerName,
      avatar: conv.partnerAvatar || partnerUser?.avatar || "",
    });
    setMobileView("chat");
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(99,102,241,0.10)] border border-purple-100 overflow-hidden"
           style={{ height: "calc(100vh - 140px)", minHeight: "500px" }}>

        <div className="flex h-full">

          {/* ── Conversations Sidebar ── */}
          <div className={`w-full sm:w-72 flex-shrink-0 border-r border-purple-50 flex flex-col ${
            mobileView === "chat" ? "hidden sm:flex" : "flex"
          }`}>

            {/* Sidebar Header */}
            <div className="px-5 py-4 border-b border-purple-50">
              <p className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-0.5">
                Inbox
              </p>
              <h2 className="text-lg font-bold text-purple-900">Messages</h2>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-xl bg-purple-50/60 animate-pulse" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <p className="text-3xl mb-2">💬</p>
                  <p className="text-sm text-purple-400">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.partnerId}
                    onClick={() => handleSelectPartner(conv)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 hover:bg-purple-50/60 transition text-left cursor-pointer ${
                      activePartner?.id === conv.partnerId ? "bg-purple-50 border-r-2 border-purple-500" : ""
                    }`}
                  >
                    {/* Avatar */}
                    {conv.partnerAvatar ? (
                      <img
                        src={conv.partnerAvatar}
                        alt={conv.partnerName}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {initials(conv.partnerName)}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-purple-900 truncate">
                          {conv.partnerName}
                        </p>
                        {conv.unread > 0 && (
                          <span className="ml-2 w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-purple-400 truncate mt-0.5">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ── Chat Window ── */}
          <div className={`flex-1 flex flex-col ${
            mobileView === "list" ? "hidden sm:flex" : "flex"
          }`}>
            {/* Mobile back button */}
            {mobileView === "chat" && (
              <button
                onClick={() => setMobileView("list")}
                className="sm:hidden flex items-center gap-2 px-4 py-3 text-sm text-purple-500 border-b border-purple-50 cursor-pointer"
              >
                ← Back
              </button>
            )}

            <ChatWindow partner={activePartner} />
          </div>
        </div>
      </div>
    </div>
  );
}
