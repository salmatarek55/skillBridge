import {
  messages,
  getConversation,
  getConversationPartners,
  addMessage,
} from "../data/messages";
import { users } from "../data/users";

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));


export async function getConversations(userId) {
  await delay();
  const partnerIds = getConversationPartners(userId);
  return partnerIds.map((partnerId) => {
    const partner = users.find((u) => u.id === partnerId);
    const convo   = getConversation(userId, partnerId);
    const last    = convo[convo.length - 1];
    const unread  = convo.filter((m) => m.receiverId === userId && !m.read).length;
    return {
      partnerId,
      partnerName:   partner?.name   || "Unknown",
      partnerAvatar: partner?.avatar || "",
      lastMessage:   last?.text      || "",
      lastAt:        last?.createdAt || "",
      unread,
    };
  });
}


export async function fetchMessages(userId1, userId2) {
  await delay();
  return getConversation(userId1, userId2);
}


export async function sendMessage({ senderId, receiverId, text }) {
  await delay(200);
  if (!text?.trim()) throw new Error("Message cannot be empty");
  return addMessage({ senderId, receiverId, text: text.trim() });
}

// mark messages as read
export async function markAsRead(senderId, receiverId) {
  await delay(100);
  messages.forEach((m) => {
    if (m.senderId === senderId && m.receiverId === receiverId) {
      m.read = true;
    }
  });
  localStorage.setItem("messages", JSON.stringify(messages));
  return { success: true };
}
