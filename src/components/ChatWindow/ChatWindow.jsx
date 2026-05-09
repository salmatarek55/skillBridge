import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchMessages, sendMessage, markAsRead } from "../../services/MessageApi";
import { emitMessage, onMessage, emitTyping, onTyping } from "../../services/socketService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ChatWindow({ partner }) {
  const { user }       = useContext(AuthContext);
  const queryClient    = useQueryClient();
  const [text, setText]= useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef      = useRef(null);
  const typingTimer    = useRef(null);

  // ── Fetch messages ──────────────────────────────────────────────────
  const { data: msgs = [] } = useQuery({
    queryKey: ["messages", user?.id, partner?.id],
    queryFn:  () => fetchMessages(user.id, partner.id),
    enabled:  !!user?.id && !!partner?.id,
    refetchInterval: 3000, // fallback polling لو الـ socket مش شغال
  });

  // Mark as read when opening conversation
  useEffect(() => {
    if (user?.id && partner?.id) {
      markAsRead(partner.id, user.id);
      queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
    }
  }, [partner?.id]);

  // ── Real-time socket listener ───────────────────────────────────────
  useEffect(() => {
    onMessage((msg) => {
      if (
        (msg.senderId === partner?.id && msg.receiverId === user?.id) ||
        (msg.senderId === user?.id   && msg.receiverId === partner?.id)
      ) {
        queryClient.invalidateQueries({ queryKey: ["messages", user?.id, partner?.id] });
        queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
      }
    });

    onTyping((data) => {
      if (data.senderId === partner?.id) {
        setTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setTyping(false), 2000);
      }
    });
  }, [partner?.id]);

  // ── Scroll to bottom on new messages ───────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // ── Send mutation ───────────────────────────────────────────────────
  const { mutate: send, isPending } = useMutation({
    mutationFn: () => sendMessage({ senderId: user.id, receiverId: partner.id, text }),
    onSuccess: (newMsg) => {
      // إرسال عبر الـ socket للـ real-time
      emitMessage({ senderId: user.id, receiverId: partner.id, text });
      setText("");
      queryClient.invalidateQueries({ queryKey: ["messages", user?.id, partner?.id] });
      queryClient.invalidateQueries({ queryKey: ["conversations", user?.id] });
    },
    onError: (err) => toast.error(err.message || "Failed to send message"),
  });

  const handleSend = () => {
    if (!text.trim() || isPending) return;
    send();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Typing indicator
    emitTyping({ senderId: user.id, receiverId: partner.id });
  };

  if (!partner) {
    return (
      <div className="flex-1 flex items-center justify-center text-indigo-300 text-sm">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-indigo-50 flex-shrink-0">
        {partner.avatar ? (
          <img src={partner.avatar} alt={partner.name} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {partner.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-indigo-900">{partner.name}</p>
          {typing && (
            <p className="text-xs text-indigo-400 animate-pulse">typing...</p>
          )}
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {msgs.length === 0 ? (
          <div className="text-center text-indigo-300 text-sm mt-10">
            No messages yet. Say hello! 👋
          </div>
        ) : (
          msgs.map((m) => {
            const isMine = m.senderId === user.id;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm"
                      : "bg-indigo-50 text-indigo-900 border border-indigo-100 rounded-bl-sm"
                  }`}
                >
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-white/60" : "text-indigo-300"}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div className="flex items-center gap-3 px-5 py-4 border-t border-indigo-50 flex-shrink-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 bg-indigo-50 border border-indigo-200 focus:border-indigo-400 rounded-xl px-4 py-2.5 text-sm text-indigo-900 placeholder:text-indigo-300 outline-none transition"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || isPending}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 transition disabled:opacity-40 cursor-pointer flex-shrink-0"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
