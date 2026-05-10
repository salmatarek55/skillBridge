
import { requests, getRequests, addRequest } from "../data/requests";
import { services } from "../data/services";
import { users } from "../data/users";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// create request
export async function createRequest({ serviceId, clientId, providerId }) {
  await delay(700);
  const service = services.find((s) => s.serviceId === serviceId);
  if (!service || service.status !== "approved") {
    throw new Error("Service unavailable");
  }
  const exists = getRequests().find(
    (r) => r.serviceId === serviceId && r.clientId === clientId
  );
  if (exists) throw new Error("You already requested this service");
  return addRequest({ serviceId, clientId, providerId });
}
              ////////////////////////////////////////////
// cancel request
export async function cancelRequest(requestId) {
  await delay(300);
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) throw new Error("Request not found");
  requests.splice(idx, 1);
  localStorage.setItem("requests", JSON.stringify(requests));
  return { success: true };
}
                ////////////////////////////////////////////
// get client request
export async function getClientRequests(clientId) {
  await delay();
  return getRequests()
    .filter((r) => r.clientId === clientId)
    .map((r) => {
      const service = services.find((s) => s.serviceId === r.serviceId);
      return {
        ...r,
        serviceTitle:    service?.title          || "Unknown Service",
        serviceCategory: service?.category       || "",
        servicePrice:    service?.price          || 0,
        deliveryTime:    service?.deliveryTime   || 0,
        providerName:    service?.provider?.name || "Provider",
        providerAvatar:  service?.provider?.avatar || "",
      };
    });
}
                ////////////////////////////////////////////
//after completing services (rating) 
export async function rateService(requestId, stars) {
  await delay(400);
  const req = requests.find((r) => r.id === requestId);
  if (!req) throw new Error("Request not found");
  if (req.status !== "completed") throw new Error("Can only rate completed services");
  req.rating = stars;
  const service = services.find((s) => s.serviceId === req.serviceId);
  if (service) {
    service.rating = stars;
  }
  localStorage.setItem("requests", JSON.stringify(requests));
  return { ...req };
}
               ////////////////////////////////////////////
// get provider request
export async function getProviderRequests(providerId) {
  await delay();
  return getRequests()
    .filter((r) => r.providerId === providerId && r.status === "pending")
    .map((r) => {
      const service = services.find((s) => s.serviceId === r.serviceId);
      const client  = users.find((u) => u.id === r.clientId);
      return {
        ...r,
        serviceTitle:    service?.title          || "Unknown Service",
        serviceCategory: service?.category       || "",
        servicePrice:    service?.price          || 0,
        clientName:      client?.name            || "Client",
        clientAvatar:    client?.avatar          || "",
      };
    });
}
             ////////////////////////////////////////////
// accept or reject request
export async function respondToRequest(requestId, action) {
  await delay(400);
  const req = requests.find((r) => r.id === requestId);
  if (!req) throw new Error("Request not found");
  req.status = action; // "accepted" | "rejected"
  localStorage.setItem("requests", JSON.stringify(requests));
  return { ...req };
}
                  ////////////////////////////////////////////
// get accepted orders for provider
export async function getProviderOrders(providerId) {
  await delay();
  return getRequests()
    .filter((r) => r.providerId === providerId && ["accepted", "completed"].includes(r.status))
    .map((r) => {
      const service = services.find((s) => s.serviceId === r.serviceId);
      const client  = users.find((u) => u.id === r.clientId);
      return {
        ...r,
        serviceTitle:    service?.title          || "Unknown Service",
        serviceCategory: service?.category       || "",
        servicePrice:    service?.price          || 0,
        deliveryTime:    service?.deliveryTime   || 0,
        clientName:      client?.name            || "Client",
        clientAvatar:    client?.avatar          || "",
      };
    });
}
             ////////////////////////////////////////////
// mark order as completed
export async function completeOrder(requestId) {
  await delay(400);
  const req = requests.find((r) => r.id === requestId);
  if (!req) throw new Error("Order not found");
  req.status = "completed";
  localStorage.setItem("requests", JSON.stringify(requests));
  return { ...req };
}
