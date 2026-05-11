import api from "./axiosInstance";
const normalizeRequest = (r) => ({
  id: r.id,
  serviceId: r.serviceId,
  serviceTitle: r.serviceTitle || "Unknown Service",
  serviceCategory: r.serviceCategory || "",
  servicePrice: r.agreedPrice || 0,
  agreedPrice: r.agreedPrice || 0,
  serviceImage: r.serviceImage || null, 
  clientName: r.clientName || "Client",
  clientAvatar: r.clientAvatar || null,
  providerName: r.providerName || "Provider",
  providerAvatar: r.providerAvatar || null,
  message: r.message || "",
  status: r.status?.toLowerCase(),
  createdAt: r.createdAt,
  completedAt: r.completedAt,
  rating: r.rating || null,
});

// Create request - Client
export async function createRequest({ serviceId, message, agreedPrice }) {
  const res = await api.post("/Requests", {
    serviceId,
    message: message || "I would like to request this service",
    agreedPrice: agreedPrice || 0,
  });
  return normalizeRequest(res.data.data);
}

// Get my requests - Client
export async function getClientRequests() {
  const res = await api.get("/Requests/my");
  return (res.data.data || []).map(normalizeRequest);
}

// Get provider incoming requests (pending only)
export async function getProviderRequests() {
  const res = await api.get("/Requests/my");
  return (res.data.data || [])
    .map(normalizeRequest)
    .filter((r) => r.status === "pending");
}

// Get provider orders (accepted + completed)
export async function getProviderOrders() {
  const res = await api.get("/Requests/my");
  return (res.data.data || [])
    .map(normalizeRequest)
    .filter((r) => ["accepted", "completed"].includes(r.status));
}

// Accept or Reject request - Provider
export async function respondToRequest(requestId, action) {
  if (action === "accepted") {
    const res = await api.patch(`/Requests/${requestId}/accept`);
    return res.data;
  } else {
    const res = await api.patch(`/Requests/${requestId}/reject`);
    return res.data;
  }
}

// Cancel request - Client
export async function cancelRequest(requestId) {
  const res = await api.patch(`/Requests/${requestId}/cancel`);
  return res.data;
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

// Get Dashboard - Provider
export async function getProviderDashboard() {
  const res = await api.get("/Dashboard");
  return res.data.data;
}