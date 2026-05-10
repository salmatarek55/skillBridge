import { services } from "../data/services";

const normalizeService = (s) => ({
  serviceId: s.serviceId,
  title: s.title,
  description: s.description,
  category: s.category,
  price: s.price,
  rating: s.rating,
  deliveryTime: s.deliveryTime,
  provider: s.provider,
  images: s.images,
  status: s.status,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

//get all services
export async function getAllServices() {
  await delay();
  return services
    .filter((s) => s.status === "approved")
    .map(normalizeService);
}
                              ////////////////////////////////////////////////

// get service by ID
export async function getServiceById(id) {
  await delay(300);
  const service = services.find(
    (s) => s.serviceId === id && s.status === "approved"
  );
  if (!service) throw new Error("Service not found or not available");
  return normalizeService(service);
}
                      ////////////////////////////////////////////////
// filter services 
export async function filterServices({ category, price, rating } = {}) {
  await delay(300);
  let result = services.filter((s) => s.status === "approved");
  if (category) result = result.filter((s) => s.category === category);
  if (price)    result = result.filter((s) => s.price <= price);
  if (rating)   result = result.filter((s) => s.rating >= rating);
  return result.map(normalizeService);
}
                    ////////////////////////////////////////////////
// search services
export async function searchServices(query) {
  await delay(300);
  return services
    .filter(
      (s) =>
        s.status === "approved" &&
        s.title.toLowerCase().includes(query.toLowerCase())
    )
    .map(normalizeService);
}
                       ////////////////////////////////////////////////
//get provider services
export async function getProviderServices(providerId) {
  await delay();
  return services
    .filter((s) => s.provider?.id === providerId)
    .map(normalizeService);
}
                ////////////////////////////////////////////////
//add service
export async function createService(providerId, providerName, providerAvatar, data) {
  await delay(600);
  const newService = {
    serviceId: `s${Date.now()}`,
    title: data.title,
    description: data.description,
    category: data.category,
    price: Number(data.price),
    rating: 0,
    deliveryTime: Number(data.deliveryTime),
    provider: { id: providerId, name: providerName, avatar: providerAvatar },
    images: data.images || [],
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  services.push(newService);
  return normalizeService(newService);
}
                ////////////////////////////////////////////////
// edit service
export async function updateService(serviceId, data) {
  await delay(500);
  const idx = services.findIndex((s) => s.serviceId === serviceId);
  if (idx === -1) throw new Error("Service not found");
  services[idx] = {
    ...services[idx],
    ...data,
    price: Number(data.price),
    deliveryTime: Number(data.deliveryTime),
    status: "pending", 
    updatedAt: new Date().toISOString(),
  };
  return normalizeService(services[idx]);
}
                   ////////////////////////////////////////////////
// delete service
export async function deleteService(serviceId) {
  await delay(400);
  const idx = services.findIndex((s) => s.serviceId === serviceId);
  if (idx === -1) throw new Error("Service not found");
  services.splice(idx, 1);
  return { success: true };
}