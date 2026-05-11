import api from "./axiosInstance";

// Create request - Client
export async function createRequest({ serviceId, message, agreedPrice }) {
  const res = await api.post("/Requests", {
    serviceId,
    message: message || "I would like to request this service",
    agreedPrice: agreedPrice || 0,
  });
  return res.data.data;
}

// Get my requests (Client or Provider)
export async function getClientRequests() {
  const res = await api.get("/Requests/my");
  return res.data.data;
}

// Get provider incoming requests (pending)
export async function getProviderRequests() {
  const res = await api.get("/Requests/my");
  return res.data.data?.filter((r) => r.status?.toLowerCase() === "pending") || [];
}

// Get provider orders (accepted + completed)
export async function getProviderOrders() {
  const res = await api.get("/Requests/my");
  return res.data.data?.filter((r) =>
    ["accepted", "completed"].includes(r.status?.toLowerCase())
  ) || [];
}

// Accept request - Provider
export async function respondToRequest(requestId, action) {
  if (action === "accepted") {
    const res = await api.patch(`/Requests/${requestId}/accept`);
    return res.data;
  } else {
    const res = await api.patch(`/Requests/${requestId}/reject`);
    return res.data;
  }
}
// Complete order - Provider
export async function completeOrder(requestId) {
  const res = await api.patch(`/Requests/${requestId}/complete`);
  return res.data;
}
// Rate service - Client
export async function rateService(requestId, ratingValue, reviewText = "") {
  const res = await api.post("/Ratings", {
    requestId,
    ratingValue,
    reviewText,
  });
  return res.data;
}
// Cancel request - Client
export async function cancelRequest(requestId) {
  const res = await api.patch(`/Requests/${requestId}/reject`);
  return res.data;
}
// Get Dashboard - Provider
export async function getProviderDashboard() {
  const res = await api.get("/Dashboard");
  return res.data.data;
}