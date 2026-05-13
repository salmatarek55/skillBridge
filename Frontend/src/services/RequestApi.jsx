import api from "./axiosInstance";

const normalizeRequest = (r) => ({
  id: r.id,
  serviceId: r.serviceId,
  serviceTitle: r.serviceTitle || "Unknown Service",
  serviceCategory: r.serviceCategory || null,
  servicePrice: r.agreedPrice || 0,
  agreedPrice: r.agreedPrice || 0,
  serviceImage: r.serviceImage || null,
  deliveryDays: r.deliveryDays || null,
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
// /////////////////////////////////////////////////////
const fixImageUrl = (url) => {
  if (!url) return null;
  return url.replace(
    "http://localhost:5242",
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5242"
  );
};
// /////////////////////////////////////////////////////
export async function createRequest({ serviceId, message, agreedPrice }) {
  const res = await api.post("/Requests", {
    serviceId,
    message: message || "I would like to request this service",
    agreedPrice: agreedPrice || 0,
  });
  return normalizeRequest(res.data.data);
}
// /////////////////////////////////////////////////////
export async function getClientRequests() {
  const res = await api.get("/Requests/my");
  const requests = (res.data.data || []).map(normalizeRequest);

  const enriched = await Promise.all(
    requests.map(async (req) => {
      if (req.serviceImage) return req;
      try {
        const svcRes = await api.get(`/Services/${req.serviceId}`);
        const svc = svcRes.data?.data;
        const rawImage = svc?.thumbnailUrl || svc?.portfolioImageUrls?.[0] || null;

        return {
          ...req,
          serviceImage: fixImageUrl(rawImage),
          serviceCategory: req.serviceCategory || svc?.categoryName || null,
          deliveryDays: req.deliveryDays || svc?.deliveryTimeInDays || null,
        };
      } catch {
        return req;
      }
    })
  );

  return enriched;
}
// /////////////////////////////////////////////////////
export async function getProviderRequests() {
  const res = await api.get("/Requests/my");
  return (res.data.data || [])
    .map(normalizeRequest)
    .filter((r) => r.status === "pending");
}
// /////////////////////////////////////////////////////
export async function getProviderOrders() {
  const res = await api.get("/Requests/my");
  return (res.data.data || [])
    .map(normalizeRequest)
    .filter((r) => ["accepted", "completed"].includes(r.status));
}
// /////////////////////////////////////////////////////
export async function respondToRequest(requestId, action) {
  if (action === "accepted") {
    const res = await api.patch(`/Requests/${requestId}/accept`);
    return res.data;
  } else {
    const res = await api.patch(`/Requests/${requestId}/reject`);
    return res.data;
  }
}
// /////////////////////////////////////////////////////
export async function cancelRequest(requestId) {
  const res = await api.patch(`/Requests/${requestId}/cancel`);
  return res.data;
}
// /////////////////////////////////////////////////////
export async function completeOrder(requestId) {
  const res = await api.patch(`/Requests/${requestId}/complete`);
  return res.data;
}
// /////////////////////////////////////////////////////
export async function rateService(requestId, ratingValue, reviewText = "") {
  const res = await api.post("/Ratings", {
    requestId,
    ratingValue,
    reviewText,
  });
  return res.data;
}
// /////////////////////////////////////////////////////
export async function getProviderDashboard() {
  const res = await api.get("/Dashboard");
  return res.data.data;
}
// /////////////////////////////////////////////////////
export async function getServiceRatings(serviceId) {
  const res = await api.get(`/Ratings/service/${serviceId}`);
  return res.data.data || [];
}