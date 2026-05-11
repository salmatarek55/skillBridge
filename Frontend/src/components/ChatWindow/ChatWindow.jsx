
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { fetchMessages, sendMessage } from "../../services/MessageApi";
import { emitMessage, onMessage, emitTyping, onTyping } from "../../services/socketService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoMdSend } from "react-icons/io";


export default function ChatWindow({ partner, requestId }) {
  const { user }    = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [text, setText]     = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef   = useRef(null);
  const typingTimer = useRef(null);

  const { data: msgs = [] } = useQuery({
    queryKey: ["messages", requestId],
    queryFn:  () => fetchMessages(requestId),
    enabled:  !!requestId,
    refetchInterval: 5000,
  });
/////////////////////////////////////////////////////
  const resolvedPartnerId =
    partner?.id ??
    msgs.find((m) => m.senderId !== user.id)?.senderId ??
    msgs.find((m) => m.receiverId !== user.id)?.receiverId;
////////////////////////////////////////////////////////
  useEffect(() => {
    onMessage((msg) => {
      if (msg.requestId === requestId) {
        queryClient.invalidateQueries({ queryKey: ["messages", requestId] });
      }
    });
    onTyping((data) => {
      if (data.senderId === resolvedPartnerId) {
        setTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setTyping(false), 2000);
      }
    });
  }, [requestId, resolvedPartnerId]);
///////////////////////////////////////////////////////////////
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);
//////////////////////////////////////////////////////////////
  const { mutate: send, isPending } = useMutation({
    mutationFn: () =>
      sendMessage({
        requestId,
        senderId:   user.id,
        receiverId: resolvedPartnerId,
        text,
      }),
    onSuccess: () => {
      emitMessage({
        requestId,
        senderId:   user.id,
        receiverId: resolvedPartnerId,
        text,
      });
      setText("");
      queryClient.invalidateQueries({ queryKey: ["messages", requestId] });
    },
    onError: (err) => toast.error(err.message || "Failed to send message"),
  });
//////////////////////////////////////////////////////////////
  const handleSend = () => {
    if (!text.trim() || isPending || !requestId) return;
    if (!resolvedPartnerId) {
      toast.error("Cannot identify recipient. Please try again.");
      return;
    }
    send();
  };
////////////////////////////////////////////////////////////////
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (resolvedPartnerId) {
      emitTyping({ senderId: user.id, receiverId: resolvedPartnerId });
    }
  };
/////////////////////////////////////////////////////////////////////
  if (!partner || !requestId) {
    return (
      <div className="flex-1 flex items-center justify-center text-indigo-300 text-sm">
        Select a conversation to start chatting
      </div>
    );
  }
/////////////////////////////////////////////////////////////////
  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-indigo-50 flex-shrink-0">
        {partner.avatar ? (
          <img src={partner.avatar} alt={partner.name}
               className="w-9 h-9 rounded-full object-cover" />
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {msgs.length === 0 ? (
          <div className="text-center text-indigo-300 text-sm mt-10">
            No messages yet. Say hello! 
          </div>
        ) : (
          msgs.map((m) => {
  const isMine = Number(m.senderId) === Number(user.id);
  return (
    <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isMine
          ? "bg-[#dcf8c6] text-gray-800 rounded-br-sm"        
          : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-sm"
      }`}>
        <p>{m.messageText}</p>

        <div className="flex items-center justify-end gap-1 mt-1">
          <p className="text-[10px] text-gray-400">
            {new Date(m.createdAt).toLocaleTimeString("en-EG", {
              hour:     "2-digit",
              minute:   "2-digit",
              timeZone: "Africa/Cairo",
            })}
          </p>
          {isMine && (
            <span className="text-[13px] leading-none" title={m.isRead ? "Seen" : "Sent"}>
              {m.isRead ? (
                <span className="text-green-500">✓✓</span>
              ) : (
                <span className="text-gray-400">✓✓</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
})
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
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
          <IoMdSend />
        </button>
      </div>
    </div>
  );
}