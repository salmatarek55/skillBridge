import { users } from "../data/users";
import { services } from "../data/services";

const delay = (ms = 450) => new Promise((res) => setTimeout(res, ms));

const ok = async (data) => {
  await delay();
  return { data: { success: true, data } };
};

// ── Dashboard Stats
export const getAdminStats = async () => {
  const pendingProviders = users.filter(u => u.role?.toLowerCase() === "provider" && u.approved === false).length;
  const pendingServices = services.filter(s => s.status === "pending").length;
  return ok({ pendingProviders, pendingServices });
};

// ── Providers 
export const getPendingProviders = () => {
  const pending = users
    .filter((u) => u.role?.toLowerCase() === "provider" && u.approved === false)
    .map((u) => ({
      id: u.id,
      name: u.fullName || u.name,
      email: u.email,
      avatar: u.avatar,
      approved: false,

    }));
  return ok(pending);
};

export const reviewProvider = (id, approve, note = "") => {
  const user = users.find((u) => u.id === id);
  if (user) {
    user.approved = approve;
    user.adminNote = note || null;
  }
  return ok({ id, approved: approve });
};

// ── Services 
export const getPendingServices = () => {
  const pending = services
    .filter((s) => s.status === "pending")
    .map((s) => ({
      ...s,
      id: s.serviceId,
      providerName: s.provider?.name || "Unknown",
      providerEmail: users.find((u) => u.id === s.providerId)?.email ?? "contact@skillbridge.com",
    }));
  return ok(pending);
};

export const reviewService = (id, approve, note = "") => {
  const svc = services.find((s) => s.serviceId === id);
  if (svc) {
    svc.status = approve ? "approved" : "rejected";
    svc.adminNote = note || null;
  }
  return ok({ id, approved: approve });
};
export const getAllUsers = async () => {
  const data = users.filter(u => u.role?.toLowerCase() !== "admin");
  return ok(data);
};