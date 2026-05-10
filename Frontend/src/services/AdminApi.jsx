import api from "./axiosInstance";

// ── Dashboard Stats ───────────────────────────────────────────────────
export const getAdminStats = async () => {
  const [providersRes, servicesRes] = await Promise.all([
    api.get("/Admin/pending-providers"),
    api.get("/Admin/pending-services"),
  ]);

  const pendingProviders = providersRes.data.data?.length || 0;
  const pendingServices  = servicesRes.data.data?.length  || 0;

  return {
    data: {
      success: true,
      data: { pendingProviders, pendingServices },
    },
  };
};

// ── Providers ─────────────────────────────────────────────────────────

export const getPendingProviders = async () => {
  const res = await api.get("/Admin/pending-providers");

  // normalize — الـ backend بيرجع { id, fullName, email, role, status, createdAt }
  const data = res.data.data.map((p) => ({
    id:     p.id,
    name:   p.fullName,
    email:  p.email,
    role:   p.role,
    status: p.status,
    avatar: `https://i.pravatar.cc/150?u=${p.email}`,
  }));

  return { data: { success: true, data } };
};

export const reviewProvider = async (id, approve) => {
  const endpoint = approve
    ? `/Admin/approve-provider/${id}`
    : `/Admin/reject-provider/${id}`;

  const res = await api.patch(endpoint);
  return { data: { success: true, data: res.data.data } };
};

// ── Services ──────────────────────────────────────────────────────────

export const getPendingServices = async () => {
  const res = await api.get("/Admin/pending-services");

  // normalize — الـ backend بيرجع deliveryTimeInDays مش deliveryTime
  const data = res.data.data.map((s) => ({
    id:           s.serviceId,
    serviceId:    s.serviceId,
    title:        s.title,
    description:  s.description,
    category:     s.category || "General",
    price:        s.price,
    deliveryTime: s.deliveryTimeInDays,
    status:       s.status,
    providerId:   s.providerId,
    provider: {
      name: s.providerName,
    },
    createdAt: s.createdAt,
  }));

  return { data: { success: true, data } };
};

export const reviewService = async (id, approve) => {
  const endpoint = approve
    ? `/Admin/approve-service/${id}`
    : `/Admin/reject-service/${id}`;

  const res = await api.patch(endpoint);
  return { data: { success: true, data: res.data.data } };
};

// ── All Users ─────────────────────────────────────────────────────────

export const getAllUsers = async () => {
  const res = await api.get("/Admin/users");

  // normalize + فلتر الـ admin
  const data = res.data.data
    .filter((u) => u.role?.toLowerCase() !== "admin")
    .map((u) => ({
      id:     u.id,
      name:   u.fullName,
      email:  u.email,
      phone:  u.phone,
      role:   u.role?.toLowerCase(),
      status: u.status,
      avatar: `https://i.pravatar.cc/150?u=${u.email}`,
    }));

  return { data: { success: true, data } };
};