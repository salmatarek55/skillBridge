import api from "./axiosInstance";
const normalizeService = (s) => ({
  serviceId: s.id,
  title: s.title,
  description: s.description,
  category: s.categoryName,
  categoryId: s.categoryId,
  price: s.price,
  rating: s.averageRating || 0,
  deliveryTime: s.deliveryTimeInDays,
  provider: {
    id: s.providerId,
    name: s.providerName,
  },
  images: s.portfolioImageUrls || [],
  thumbnailUrl: s.thumbnailUrl || s.portfolioImageUrls?.[0], // ← مهم
  status: s.status?.toLowerCase(),
  createdAt: s.createdAt,
});
// GET all approved services
export async function getAllServices() {
  const res = await api.get("/Services");
  return res.data.data.map(normalizeService);
}

// GET service by ID
export async function getServiceById(id) {
  const res = await api.get(`/Services/${id}`);
  return normalizeService(res.data.data);
}

// GET provider's own services
export async function getProviderServices() {
  const res = await api.get("/Services/my-services");
  return res.data.data.map(normalizeService);
}

// POST create service
export async function createService(data) {
  const res = await api.post("/Services", {
    title: data.title,
    description: data.description,
    categoryId: Number(data.categoryId),
    price: Number(data.price),
    deliveryTimeInDays: Number(data.deliveryTime),
    portfolioImageUrls: data.images || [],
  });
  return normalizeService(res.data.data);
}

// PUT update service
export async function updateService(serviceId, data) {
  const res = await api.put(`/Services/${serviceId}`, {
    title: data.title,
    description: data.description,
    categoryId: Number(data.categoryId),
    price: Number(data.price),
    deliveryTimeInDays: Number(data.deliveryTime),
    portfolioImageUrls: data.images || [],
  });
  return normalizeService(res.data.data);
}

// DELETE service
export async function deleteService(serviceId) {
  const res = await api.delete(`/Services/${serviceId}`);
  return res.data;
}

// Filter services
export async function filterServices({ category, price, rating } = {}) {
  const res = await api.get("/Services");
  let result = res.data.data.map(normalizeService);
  if (category) result = result.filter((s) => s.category === category);
  if (price) result = result.filter((s) => s.price <= price);
  if (rating) result = result.filter((s) => s.rating >= rating);
  return result;
}

// Search services
export async function searchServices(query) {
  const res = await api.get("/Services");
  return res.data.data
    .map(normalizeService)
    .filter((s) => s.title.toLowerCase().includes(query.toLowerCase()));
}