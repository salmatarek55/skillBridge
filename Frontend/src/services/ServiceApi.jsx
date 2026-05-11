import api from "./axiosInstance";

// ================= NORMALIZE =================
const normalizeService = (s) => {
  return {
    serviceId: s.id,

    title: s.title || "",
    description: s.description || "",

    category: s.categoryName || "",
    categoryId: s.categoryId || null,

    price: s.price || 0,

    rating: s.averageRating || 0,

    deliveryTime: s.deliveryTimeInDays || 0,

    provider: {
      id: s.providerId,
      name: s.providerName,
    },

    images: s.portfolioImageUrls || [],

    thumbnailUrl:
      s.thumbnailUrl ||
      s.portfolioImageUrls?.[0] ||
      "",

    status: s.status?.toLowerCase() || "pending",

    createdAt: s.createdAt,
  };
};

// ================= GET ALL =================
export async function getAllServices() {
  const res = await api.get("/Services");

  const data = res.data?.data || [];

  return data.map(normalizeService);
}

// ================= GET ONE =================
export async function getServiceById(id) {
  const res = await api.get(`/Services/${id}`);

  return normalizeService(res.data.data);
}

// ================= MY SERVICES =================
export async function getProviderServices() {
  const res = await api.get("/Services/my-services");

  const data = res.data?.data || [];

  return data.map(normalizeService);
}

// ================= CREATE =================
export async function createService(payload) {
  const body = {
    title: payload.title,
    description: payload.description,

    categoryId: Number(payload.categoryId),

    price: Number(payload.price),

    deliveryTimeInDays: Number(payload.deliveryTime),

    portfolioImageUrls: payload.images || [],
  };

  const res = await api.post("/Services", body);

  return normalizeService(res.data.data);
}

// ================= UPDATE =================
export async function updateService(serviceId, payload) {
  const body = {
    title: payload.title,
    description: payload.description,

    categoryId: Number(payload.categoryId),

    price: Number(payload.price),

    deliveryTimeInDays: Number(payload.deliveryTime),

    portfolioImageUrls: payload.images || [],
  };

  const res = await api.put(`/Services/${serviceId}`, body);

  return normalizeService(res.data.data);
}

// ================= DELETE =================
export async function deleteService(serviceId) {
  const res = await api.delete(`/Services/${serviceId}`);

  return res.data;
}