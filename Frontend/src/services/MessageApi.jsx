
import api from "../services/axiosInstance";

export async function fetchMessages(requestId) {
  const res = await api.get(`/Messages/conversation/${requestId}`);
  return res.data.data;
}
/////////////////////////////////////////////////////
export async function sendMessage({ requestId, senderId, receiverId, text }) {
  if (!text?.trim()) throw new Error("Message cannot be empty");
  const res = await api.post("/Messages", {
    requestId,
    senderId,
    receiverId,
    messageText: text.trim(),
  });
  return res.data.data;
}